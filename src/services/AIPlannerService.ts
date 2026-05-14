import { TaskService } from './TaskService';
import { FocusRecommendation } from '../lib/focusEngine';

/**
 * AI Planner Service - Intelligent task selection based on energy and priority.
 */
export const AIPlannerService = {
  async getDailyRecommendations(currentEnergy: number): Promise<FocusRecommendation[]> {
    const tasks = await TaskService.getActiveTasks();
    const pending = tasks.filter((t: any) => t.status === 'pending');
    
    if (pending.length === 0) return [];

    // Sort by priority and cognitive load
    const sorted = [...pending].sort((a, b) => {
      // Priority first
      if (a.priority !== b.priority) return b.priority - a.priority;
      
      // Then cognitive load matching energy
      const loadMap: any = { alta: 3, media: 2, baja: 1 };
      const aLoad = loadMap[a.cognitive_load || 'media'];
      const bLoad = loadMap[b.cognitive_load || 'media'];
      
      // If high energy, prefer high load
      if (currentEnergy > 70) return bLoad - aLoad;
      // If low energy, prefer low load
      return aLoad - bLoad;
    });

    return sorted.slice(0, 3).map(t => ({
      type: 'task',
      id: t.id,
      title: t.title,
      reason: this.getReason(t, currentEnergy)
    }));
  },

  getReason(task: any, energy: number): string {
    const load = task.cognitive_load || 'media';
    if (energy > 70 && load === 'alta') return 'Tu energía es alta, momento perfecto para este reto.';
    if (energy < 40 && load === 'baja') return 'Carga baja, ideal para mantener el ritmo con poca energía.';
    if (task.priority === 3) return 'Crítico para tus metas de esta temporada.';
    return 'Recomendado para mantener tu consistencia.';
  }
};
