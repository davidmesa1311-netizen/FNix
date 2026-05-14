import { TaskRepository, generateUUID } from '../db/repository';
import { ActivityService } from './ActivityService';

/**
 * Servicio de Tareas (Capa de Lógica de Negocio)
 */
export const TaskService = {
  async getActiveTasks() {
    return await TaskRepository.getAll();
  },

  async addTask(title: string, priority: number = 1, category: string = 'General', goalId?: number, dueDate?: string, cognitiveLoad: string = 'media') {
    if (!title.trim()) throw new Error('El título de la tarea es obligatorio.');
    
    const uuid = generateUUID();
    const newTask = {
      uuid, 
      title, 
      priority, 
      category, 
      goal_id: goalId, 
      status: 'pending',
      due_date: dueDate || new Date().toISOString().split('T')[0],
      cognitive_load: cognitiveLoad
    };

    const result = await TaskRepository.save(newTask);
    await ActivityService.log('create', 'task', uuid, `Tarea creada: ${title}`);
    return result;
  },

  async toggleTaskStatus(task: any) {
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending';
    const result = await TaskRepository.save({ ...task, status: nextStatus });
    await ActivityService.log(
      nextStatus === 'completed' ? 'complete' : 'reopen', 
      'task', task.uuid, `Tarea ${nextStatus}: ${task.title}`
    );
    return result;
  },

  async removeTask(id: number, taskUuid: string, taskTitle: string) {
    const result = await TaskRepository.delete(id);
    await ActivityService.log('delete', 'task', taskUuid, `Tarea eliminada: ${taskTitle}`);
    return result;
  }
};
