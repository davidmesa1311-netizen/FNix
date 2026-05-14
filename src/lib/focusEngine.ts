import { supabase } from '../lib/supabase';

export interface FocusRecommendation {
  type: 'task' | 'habit' | 'goal';
  id: number;
  title: string;
  reason: string;
}

/**
 * Motor de Enfoque - Supabase
 */
export const getDailyFocus = async (): Promise<FocusRecommendation[]> => {
  try {
    const { data: settingsData } = await supabase.from('focus_settings').select('key, value');
    const settings: Record<string, string> = {};
    (settingsData || []).forEach(r => { settings[r.key] = r.value; });

    if (settings.auto_suggestions !== 'true') return [];

    const recommendations: FocusRecommendation[] = [];

    // Metas urgentes
    const { data: urgentGoals } = await supabase
      .from('goals')
      .select('id, title')
      .eq('status', 'active')
      .eq('is_deleted', false)
      .not('target_date', 'is', null)
      .order('target_date', { ascending: true })
      .limit(1);

    // Tareas críticas
    const { data: criticalTasks } = await supabase
      .from('tasks')
      .select('id, title, priority')
      .eq('status', 'pending')
      .eq('is_deleted', false)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(2);

    // Hábitos pendientes hoy
    const today = new Date().toISOString().split('T')[0];
    const { data: allHabits } = await supabase.from('habits').select('id, title');
    const { data: todayLogs } = await supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('completed_at', today);

    const completedIds = new Set((todayLogs || []).map(l => l.habit_id));
    const riskyHabits = (allHabits || []).filter(h => !completedIds.has(h.id)).slice(0, 1);

    // Actividad reciente
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
    const { count } = await supabase
      .from('activity_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'complete')
      .gte('created_at', threeDaysAgo);

    const isStagnant = (count || 0) === 0;

    if (isStagnant && (criticalTasks || []).length > 0) {
      const t = criticalTasks![criticalTasks!.length - 1];
      recommendations.push({
        type: 'task', id: t.id, title: t.title,
        reason: 'Reimpulso: No has completado tareas recientemente.'
      });
    }

    if ((urgentGoals || []).length > 0) {
      recommendations.push({
        type: 'goal', id: urgentGoals![0].id, title: urgentGoals![0].title,
        reason: 'Prioridad estratégica: Meta con vencimiento próximo.'
      });
    }

    (criticalTasks || []).forEach(task => {
      recommendations.push({
        type: 'task', id: task.id, title: task.title,
        reason: task.priority === 3 ? 'Prioridad táctica: Tarea crítica.' : 'Mantenimiento: Tarea pendiente.'
      });
    });

    if (riskyHabits.length > 0 && recommendations.length < 3) {
      recommendations.push({
        type: 'habit', id: riskyHabits[0].id, title: riskyHabits[0].title,
        reason: 'Constancia: Hábito pendiente para completar tu racha hoy.'
      });
    }

    return recommendations.slice(0, 3);
  } catch (err) {
    console.error('Error en focusEngine:', err);
    return [];
  }
};
