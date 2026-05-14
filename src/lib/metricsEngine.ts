import { supabase } from '../lib/supabase';

export interface PerformanceMetrics {
  disciplineIndex: number;
  goalProgressIndex: number;
  lifeBalanceIndex: number;
  consistencyIndex: number;
  executionVelocity: number;
  estimatedEnergy: number;
}

/**
 * Motor de Métricas - Supabase
 */
export const getPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  try {
    // Settings
    const { data: settingsData } = await supabase.from('focus_settings').select('key, value');
    const settings: Record<string, string> = {};
    (settingsData || []).forEach(r => { settings[r.key] = r.value; });

    const wTasks = (Number(settings.weight_tasks) || 40) / 100;
    const wHabits = (Number(settings.weight_habits) || 40) / 100;

    // Task stats
    const { data: allTasks } = await supabase
      .from('tasks')
      .select('status, category, created_at, goal_id, cognitive_load')
      .eq('is_deleted', false);

    const tasks = allTasks || [];
    const taskTotal = tasks.length;
    const taskCompleted = tasks.filter(t => t.status === 'completed').length;
    const taskRate = taskTotal > 0 ? taskCompleted / taskTotal : 0;

    // Habit stats
    const { count: totalHabits } = await supabase
      .from('habits')
      .select('id', { count: 'exact', head: true });

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const { count: weeklyCompletions } = await supabase
      .from('habit_logs')
      .select('id', { count: 'exact', head: true })
      .gte('completed_at', sevenDaysAgo);

    const habitsCount = totalHabits || 0;
    const habitRate = habitsCount > 0 ? ((weeklyCompletions || 0) / (habitsCount * 7)) : 0;
    const disciplineIndex = Math.round(((taskRate * wTasks) + (habitRate * wHabits)) * 100 / (wTasks + wHabits));

    // Goal progress
    const goalGroups: Record<number, { total: number; completed: number }> = {};
    tasks.filter(t => t.goal_id).forEach(t => {
      if (!goalGroups[t.goal_id]) goalGroups[t.goal_id] = { total: 0, completed: 0 };
      goalGroups[t.goal_id].total++;
      if (t.status === 'completed') goalGroups[t.goal_id].completed++;
    });
    const groupValues = Object.values(goalGroups);
    const avgGoalProgress = groupValues.length > 0
      ? groupValues.reduce((sum, g) => sum + (g.completed / g.total), 0) / groupValues.length
      : 0;
    const goalProgressIndex = Math.round(avgGoalProgress * 100);

    // Balance (categories)
    const uniqueCategories = new Set(tasks.map(t => t.category).filter(Boolean));
    const lifeBalanceIndex = Math.min(Math.round((uniqueCategories.size / 5) * 100), 100);

    // Consistency (active days)
    const recentTasks = tasks.filter(t => t.created_at >= new Date(Date.now() - 7 * 86400000).toISOString());
    const activeDays = new Set(recentTasks.map(t => t.created_at?.split('T')[0]));
    const consistencyIndex = Math.round((activeDays.size / 7) * 100);

    // Velocity
    const { count: completedWeekly } = await supabase
      .from('activity_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'complete')
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());

    const executionVelocity = Math.min(Math.round(((completedWeekly || 0) / 10) * 100), 100);

    // Energy Estimation
    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter(t => t.status === 'completed' && t.created_at?.startsWith(today));
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    let energy = 80; // Base baseline
    
    // Penalize by pending load
    pendingTasks.forEach(t => {
      const load = t.cognitive_load || 'media';
      if (load === 'alta') energy -= 8;
      if (load === 'media') energy -= 3;
      if (load === 'baja') energy -= 1;
    });

    // Reward for momentum
    energy += completedToday.length * 5;
    
    // Clamp
    const estimatedEnergy = Math.max(10, Math.min(100, energy));

    return {
      disciplineIndex,
      goalProgressIndex,
      lifeBalanceIndex,
      consistencyIndex,
      executionVelocity,
      estimatedEnergy
    };
  } catch (err) {
    console.error('Error en metricsEngine:', err);
    return { disciplineIndex: 0, goalProgressIndex: 0, lifeBalanceIndex: 0, consistencyIndex: 0, executionVelocity: 0, estimatedEnergy: 0 };
  }
};
