import { getTasks, createTask, updateTask, deleteTask, getGoals, createGoal, updateGoal } from './db';

/**
 * Utilidad para generar UUIDs v4 (mantenida por compatibilidad)
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Capa de Repositorio - Abstracción de Datos para Supabase
 */

export const TaskRepository = {
  async getAll() {
    return await getTasks();
  },

  async save(task: any) {
    if (task.id) {
      const { id, ...updates } = task;
      return await updateTask(id, updates);
    } else {
      return await createTask(task);
    }
  },

  async delete(id: number) {
    return await deleteTask(id);
  }
};

export const GoalRepository = {
  async getAll() {
    return await getGoals();
  },

  async save(goal: any) {
    if (goal.id) {
      const { id, ...updates } = goal;
      return await updateGoal(id, updates);
    } else {
      return await createGoal(goal);
    }
  }
};
