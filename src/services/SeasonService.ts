import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import { ActivityService } from './ActivityService';

export interface Season {
  id: number;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
  user_id?: string;
}

export const SeasonService = {
  async getAll(): Promise<Season[]> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async startNewSeason(title: string, theme: string) {
    const userId = await getCurrentUserId();
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    // Mark previous active seasons as completed (only for this user)
    await supabase.from('seasons').update({ status: 'completed' }).eq('status', 'active').eq('user_id', userId);

    const { data, error } = await supabase
      .from('seasons')
      .insert({ 
        title, 
        theme, 
        start_date: today, 
        end_date: nextMonth,
        status: 'active',
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    await ActivityService.log('create', 'season', data.id.toString(), `Ciclo iniciado: ${title}`);
    return data;
  },

  async deleteSeason(seasonId: number) {
    const { error } = await supabase.from('seasons').delete().eq('id', seasonId);
    if (error) throw error;
  }
};
