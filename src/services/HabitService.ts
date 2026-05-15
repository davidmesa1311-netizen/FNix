import { supabase } from '../lib/supabase';
import { ActivityService } from './ActivityService';

export interface Habit {
  id: number;
  title: string;
  category: string;
  created_at: string;
}

export const HabitService = {
  async getAll(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addHabit(title: string, category: string = 'Salud') {
    const { data, error } = await supabase
      .from('habits')
      .insert({ title, category })
      .select()
      .single();
    if (error) throw error;
    await ActivityService.log('create', 'habit', data.id.toString(), `Hábito creado: ${title}`);
    return data;
  },

  async toggleToday(habitId: number, isCurrentlyCompleted: boolean) {
    const today = new Date().toISOString().split('T')[0];
    if (isCurrentlyCompleted) {
      await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_at', today);
      await ActivityService.log('uncheck', 'habit', habitId.toString(), 'Hábito desmarcado');
    } else {
      await supabase
        .from('habit_logs')
        .insert({ habit_id: habitId, completed_at: today });
      await ActivityService.log('check', 'habit', habitId.toString(), 'Hábito completado');
    }
  },

  async getTodayLogs() {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('completed_at', today);
    return new Set((data || []).map(l => l.habit_id));
  },

  async deleteHabit(habit: Habit) {
    const { error } = await supabase.from('habits').delete().eq('id', habit.id);
    if (error) throw error;
    await ActivityService.log('delete', 'habit', habit.id.toString(), `Hábito eliminado: ${habit.title}`);
  }
};
