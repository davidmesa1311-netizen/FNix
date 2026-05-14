import { supabase } from '../lib/supabase';
export { supabase };

// ── Settings ──────────────────────────────────────────────────────
export const getSettings = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase.from('focus_settings').select('key, value');
  if (error) throw error;
  const settings: Record<string, string> = {};
  (data || []).forEach((row: any) => { settings[row.key] = row.value; });
  return settings;
};

export const getSetting = async (key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('focus_settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error) return null;
  return data?.value ?? null;
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  await supabase
    .from('focus_settings')
    .upsert({ key, value }, { onConflict: 'key' });
};

// ── Goals ─────────────────────────────────────────────────────────
export const getGoals = async () => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createGoal = async (goal: { title: string; description?: string; category?: string; target_date?: string }) => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateGoal = async (id: number, updates: any) => {
  const { error } = await supabase
    .from('goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

export const deleteGoal = async (id: number) => {
  const { error } = await supabase
    .from('goals')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

// ── Tasks ─────────────────────────────────────────────────────────
export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_deleted', false)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createTask = async (task: { title: string; description?: string; goal_id?: number; priority?: number; category?: string }) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTask = async (id: number, updates: any) => {
  const { error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

export const deleteTask = async (id: number) => {
  const { error } = await supabase
    .from('tasks')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

// ── Habits ────────────────────────────────────────────────────────
export const getHabits = async () => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createHabit = async (habit: { title: string; frequency?: string; goal_id?: number; category?: string }) => {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ── Dashboard ─────────────────────────────────────────────────────
export const getDashboardSummary = async () => {
  const [goalsRes, tasksRes, habitsRes] = await Promise.all([
    supabase.from('goals').select('id, status', { count: 'exact' }).eq('is_deleted', false),
    supabase.from('tasks').select('id, status', { count: 'exact' }).eq('is_deleted', false),
    supabase.from('habits').select('id', { count: 'exact' })
  ]);

  const goals = goalsRes.data || [];
  const tasks = tasksRes.data || [];

  return {
    goals: {
      total: goals.length,
      active: goals.filter((g: any) => g.status === 'active').length
    },
    tasks: {
      total: tasks.length,
      pending: tasks.filter((t: any) => t.status === 'pending').length,
      completed: tasks.filter((t: any) => t.status === 'completed').length
    },
    habits: { total: habitsRes.count || 0 }
  };
};

// ── Legacy Compatibility ──────────────────────────────────────────
export const executeQuery = async (sql: string, _params: any[] = []) => {
  if (sql.includes('onboarding_completed')) {
    const value = await getSetting('onboarding_completed');
    return [[value]];
  }
  console.warn('executeQuery legacy called:', sql);
  return [];
};

export const initDB = async () => {
  console.log('✅ Conectado a Supabase');
  return true;
};

export const getGoalProgress = async (goalId?: number) => {
  if (!goalId) return { tasks: { total: 0, completed: 0 }, habits: { total_habits: 0, total_completions: 0 } };

  const { data: taskData } = await supabase
    .from('tasks')
    .select('status')
    .eq('goal_id', goalId)
    .eq('is_deleted', false);

  const tasks = taskData || [];
  return {
    tasks: {
      total: tasks.length,
      completed: tasks.filter((t: any) => t.status === 'completed').length
    },
    habits: { total_habits: 0, total_completions: 0 }
  };
};

export const getDailyCategorySummary = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('tasks')
    .select('category')
    .eq('is_deleted', false)
    .gte('created_at', today);

  const summary: Record<string, number> = {};
  (data || []).forEach((t: any) => {
    const cat = t.category || 'General';
    summary[cat] = (summary[cat] || 0) + 1;
  });

  return Object.entries(summary).map(([category, count]) => ({ category, count }));
};
