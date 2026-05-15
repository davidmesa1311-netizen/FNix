import { supabase } from '../lib/supabase';
import { ActivityService } from './ActivityService';

export interface FinanceRecord {
  id: number;
  description: string;
  amount: number;
  category: string;
  due_day: number;
  created_at: string;
}

export const FinanceService = {
  async getAll(): Promise<FinanceRecord[]> {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .order('due_day', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addRecord(description: string, amount: number, category: string, dueDay: number) {
    const { data, error } = await supabase
      .from('finances')
      .insert({ description, amount, category, due_day: dueDay })
      .select()
      .single();
    if (error) throw error;
    await ActivityService.log('create', 'finance', data.id.toString(), `Gasto registrado: ${description}`);
    return data;
  },

  async deleteRecord(id: number) {
    const { error } = await supabase.from('finances').delete().eq('id', id);
    if (error) throw error;
  }
};
