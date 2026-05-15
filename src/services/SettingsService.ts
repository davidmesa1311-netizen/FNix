import { supabase } from '../lib/supabase';

export const SettingsService = {
  async getSettings(): Promise<Record<string, string>> {
    const { data, error } = await supabase.from('focus_settings').select('key, value');
    if (error) throw error;
    const settings: Record<string, string> = {};
    (data || []).forEach((row: any) => { settings[row.key] = row.value; });
    return settings;
  },

  async setSetting(key: string, value: string) {
    const { error } = await supabase
      .from('focus_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
  }
};
