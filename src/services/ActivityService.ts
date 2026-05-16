import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';

export const ActivityService = {
  async log(action: string, entityType: string, entityId: string, details: string = '') {
    try {
      const userId = await getCurrentUserId();
      await supabase.from('activity_logs').insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        user_id: userId
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  },

  async getRecentActivity(limit: number = 50) {
    const userId = await getCurrentUserId();
    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }
};
