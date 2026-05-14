import { GoalRepository, generateUUID } from '../db/repository';

/**
 * Servicio de Metas (Capa de Lógica de Negocio)
 * Orquestador de la estrategia de metas y sus dependencias.
 */
export const GoalService = {
  async getActiveGoals() {
    return await GoalRepository.getAll();
  },

  async createGoal(title: string, description: string, category: string, targetDate: string) {
    if (!title.trim()) throw new Error('El título de la meta es obligatorio.');

    const newGoal = {
      uuid: generateUUID(),
      title,
      description,
      category,
      target_date: targetDate,
      status: 'active'
    };

    return await GoalRepository.save(newGoal);
  }
};
