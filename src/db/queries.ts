import { supabase } from '../lib/supabase';
import { getSettings, getGoals, getTasks } from './db';

/**
 * Capa de Acceso a Datos - Supabase
 */

// --- TAREAS ---
export const fetchTasks = async (filter: string = 'all') => {
  const tasks = await getTasks();
  if (filter === 'pending') return tasks.filter((t: any) => t.status === 'pending');
  return tasks;
};

// --- METAS ---
export const fetchActiveGoals = async () => {
  const goals = await getGoals();
  return goals.filter((g: any) => g.status === 'active');
};

// --- HÁBITOS ---
export const fetchHabitsWithStatus = async () => {
  const { data } = await supabase
    .from('habits')
    .select(`
      id, title, category, goal_id,
      habit_logs!left(id, completed_at)
    `);
  
  return (data || []).map(h => ({
    ...h,
    completed_today: (h.habit_logs || []).some(
      (l: any) => l.completed_at === new Date().toISOString().split('T')[0]
    ) ? 1 : 0
  }));
};

// --- CONFIGURACIÓN ---
export const fetchAllSettings = async () => {
  return await getSettings();
};

// --- TEMPORADAS ---
export const fetchCurrentSeason = async () => {
  const { data } = await supabase
    .from('seasons')
    .select('*')
    .eq('status', 'active')
    .limit(1)
    .single();
  return data || null;
};

// --- FINANZAS ---
export const fetchPaymentsSummary = async () => {
  const { data } = await supabase
    .from('monthly_payments')
    .select('*')
    .order('due_day', { ascending: true });
  
  const payments = data || [];
  const total = payments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  return { payments, total };
};
