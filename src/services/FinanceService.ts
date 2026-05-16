import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import { ActivityService } from './ActivityService';

export interface FinanceRecord {
  id: number;
  title: string;
  amount: number;
  due_day: number;
  status: string;
  user_id?: string;
}

export const FinanceService = {
  async getAll(): Promise<FinanceRecord[]> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('monthly_payments')
      .select('*')
      .eq('user_id', userId)
      .order('due_day', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addRecord(title: string, amount: number, dueDay: number) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('monthly_payments')
      .insert({ title, amount, due_day: dueDay, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    await ActivityService.log('create', 'finance', data.id.toString(), `Pago registrado: ${title}`);
    return data;
  },

  async deleteRecord(id: number) {
    const { error } = await supabase.from('monthly_payments').delete().eq('id', id);
    if (error) throw error;
  }
};
