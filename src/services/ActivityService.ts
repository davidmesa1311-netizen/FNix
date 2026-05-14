import { supabase } from '../lib/supabase';

/**
 * Servicio de Auditoría y Actividad - Supabase
 */
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
      console.error('Error al registrar actividad:', err);
    }
  },

  async getRecentActivity(limit: number = 50, action?: string, entityType?: string) {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (action) query = query.eq('action', action);
    if (entityType) query = query.eq('entity_type', entityType);

    const { data } = await query;
    return data || [];
  },

  async getWeeklyVelocityData() {
    const sixDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString();
    const { data } = await supabase
      .from('activity_logs')
      .select('created_at')
      .eq('action', 'complete')
      .gte('created_at', sixDaysAgo);

    // Agrupar por día
    const grouped: Record<string, number> = {};
    (data || []).forEach(row => {
      const day = row.created_at?.split('T')[0];
      if (day) grouped[day] = (grouped[day] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }
};
