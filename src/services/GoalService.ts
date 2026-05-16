import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import { ActivityService } from './ActivityService';

export interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  target_date: string | null;
  is_deleted: boolean;
  created_at: string;
  user_id?: string;
}

export const GoalService = {
  async getAll(): Promise<Goal[]> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addGoal(goal: Partial<Goal>) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, status: 'active', user_id: userId })
      .select()
      .single();
    if (error) throw error;
    await ActivityService.log('create', 'goal', data.id.toString(), `Meta creada: ${goal.title}`);
    return data;
  },

  async deleteGoal(goal: Goal) {
    const { error } = await supabase
      .from('goals')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', goal.id);
    if (error) throw error;
    await ActivityService.log('delete', 'goal', goal.id.toString(), `Meta eliminada: ${goal.title}`);
  }
};
