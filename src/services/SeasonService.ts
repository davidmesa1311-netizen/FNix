import { supabase } from '../lib/supabase';
import { ActivityService } from './ActivityService';

export interface Season {
  id: number;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
}

export const SeasonService = {
  async getAll(): Promise<Season[]> {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async startNewSeason(title: string, theme: string) {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    // Mark previous active seasons as completed
    await supabase.from('seasons').update({ status: 'completed' }).eq('status', 'active');

    const { data, error } = await supabase
      .from('seasons')
      .insert({ 
        title, 
        theme, 
        start_date: today, 
        end_date: nextMonth,
        status: 'active' 
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
