import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';

export const SettingsService = {
  async getSettings(): Promise<Record<string, string>> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('focus_settings')
      .select('key, value')
      .eq('user_id', userId);
    if (error) throw error;
    const settings: Record<string, string> = {};
    (data || []).forEach((row: any) => { settings[row.key] = row.value; });
    return settings;
  },

  async setSetting(key: string, value: string) {
    const userId = await getCurrentUserId();
    const { error } = await supabase
      .from('focus_settings')
      .upsert({ key, value, user_id: userId }, { onConflict: 'user_id,key' });
    if (error) throw error;
  }
};
