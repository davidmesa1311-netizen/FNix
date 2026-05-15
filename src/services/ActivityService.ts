import { supabase } from '../lib/supabase';

export const ActivityService = {
  async log(action: string, entityType: string, entityId: string, details: string = '') {
    try {
      await supabase.from('activity_logs').insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  },

  async getRecentActivity(limit: number = 50) {
    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }
};
