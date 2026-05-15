import { supabase } from './supabase';

export interface FocusRecommendation {
  type: 'task' | 'habit' | 'goal';
  id: string | number;
  title: string;
  reason: string;
}

/**
 * Focus Engine - Recommends actions based on energy and urgency
 */
export const getDailyFocus = async (): Promise<FocusRecommendation[]> => {
  try {
    const recommendations: FocusRecommendation[] = [];

    // 1. Critical Tasks
    const { data: criticalTasks } = await supabase
      .from('tasks')
      .select('uuid, title, priority')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .limit(2);

    if (criticalTasks && criticalTasks.length > 0) {
      criticalTasks.forEach(task => {
        recommendations.push({
          type: 'task',
          id: task.uuid,
          title: task.title,
          reason: 'Prioridad táctica: Tarea crítica pendiente.'
        });
      });
    }

    // 2. Pending Habits
    const today = new Date().toISOString().split('T')[0];
    const { data: habits } = await supabase.from('habits').select('id, title');
    const { data: logs } = await supabase.from('habit_logs').select('habit_id').eq('completed_at', today);
    
    const completedIds = new Set((logs || []).map(l => l.habit_id));
    const pendingHabits = (habits || []).filter(h => !completedIds.has(h.id)).slice(0, 1);

    if (pendingHabits.length > 0) {
      recommendations.push({
        type: 'habit',
        id: pendingHabits[0].id,
        title: pendingHabits[0].title,
        reason: 'Mantenimiento de racha: Hábito diario pendiente.'
      });
    }

    return recommendations.slice(0, 3);
  } catch (error) {
    console.error('FocusEngine Error:', error);
    return [];
  }
};
