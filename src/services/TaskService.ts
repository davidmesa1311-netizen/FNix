import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import { ActivityService } from './ActivityService';

export interface Task {
  id: number;
  uuid: string;
  title: string;
  priority: number;
  category: string;
  status: 'pending' | 'completed';
  due_date: string;
  is_deleted: boolean;
  created_at: string;
  cognitive_load?: 'baja' | 'media' | 'alta';
  user_id?: string;
}

export const TaskService = {
  async getActiveTasks(): Promise<Task[]> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addTask(title: string, priority: number = 1, category: string = 'General', dueDate?: string) {
    if (!title.trim()) throw new Error('El título es obligatorio.');
    
    const userId = await getCurrentUserId();
    const uuid = crypto.randomUUID();
    const newTask = {
      uuid,
      title,
      priority,
      category,
      status: 'pending',
      due_date: dueDate || new Date().toISOString().split('T')[0],
      user_id: userId
    };

    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
    if (error) throw error;

    await ActivityService.log('create', 'task', uuid, `Tarea creada: ${title}`);
    return data;
  },

  async toggleTaskStatus(task: Task) {
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending';
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', task.id)
      .select()
      .single();
    
    if (error) throw error;

    await ActivityService.log(
      nextStatus === 'completed' ? 'complete' : 'reopen', 
      'task', 
      task.uuid, 
      `Tarea ${nextStatus}: ${task.title}`
    );
    return data;
  },

  async removeTask(task: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', task.id);
    
    if (error) throw error;

    await ActivityService.log('delete', 'task', task.uuid, `Tarea eliminada: ${task.title}`);
  }
};
