import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Circle, 
  CheckCircle2,
  Tag,
  Calendar,
  Flag,
  Trash2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { TaskService } from '../services/TaskService';
import type { Task } from '../services/TaskService';
import './Tareas.css';

const Tareas: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatorOpen, setCreatorOpen] = useState(false);
  
  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState(1);
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await TaskService.getActiveTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await TaskService.addTask(newTitle, newPriority, newCategory, newDueDate);
      setNewTitle('');
      setCreatorOpen(false);
      loadTasks();
    } catch (error) {
      console.error('Error al añadir tarea:', error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await TaskService.toggleTaskStatus(task);
      loadTasks();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await TaskService.removeTask(task);
      loadTasks();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'hsl(var(--danger))';
      case 2: return 'hsl(var(--warning))';
      default: return 'hsl(var(--brand))';
    }
  };

  return (
    <div className="tareas-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Mis Tareas</h1>
          <p className="subtitle">Gestiona tu enfoque diario con precisión.</p>
        </div>
        {!isCreatorOpen && (
          <button className="fab-button" onClick={() => setCreatorOpen(true)}>
            <Plus size={24} />
            <span>Nueva Tarea</span>
          </button>
        )}
      </header>

      {/* Inline Smart Creator */}
      {isCreatorOpen && (
        <div className="creator-card premium-card animate-fade">
          <form onSubmit={handleAddTask}>
            <input 
              autoFocus
              className="creator-input"
              placeholder="¿Qué necesitas enfocar hoy?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            
            <div className="creator-actions">
              <div className="action-group">
                <div className="priority-selector">
                  {[1, 2, 3].map(p => (
                    <button 
                      key={p}
                      type="button"
                      className={`priority-chip ${newPriority === p ? 'active' : ''}`}
                      style={{ '--p-color': getPriorityColor(p) } as any}
                      onClick={() => setNewPriority(p)}
                    >
                      <Flag size={14} />
                      {p === 3 ? 'Alta' : p === 2 ? 'Media' : 'Baja'}
                    </button>
                  ))}
                </div>
                
                <div className="date-selector">
                  <Calendar size={14} />
                  <input 
                    type="date" 
                    value={newDueDate} 
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-buttons">
                <button type="button" className="btn-ghost" onClick={() => setCreatorOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>
                  <Sparkles size={16} />
                  Crear Tarea
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="tasks-grid">
        {loading ? (
          <div className="loading-state">Cargando tareas...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={48} />
            <p>Todo despejado. ¡Buen trabajo!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-card premium-card ${task.status === 'completed' ? 'completed' : ''}`}>
              <div className="task-side-accent" style={{ background: getPriorityColor(task.priority) }} />
              
              <button className="status-toggle" onClick={() => handleToggleStatus(task)}>
                {task.status === 'completed' ? (
                  <CheckCircle2 className="icon-done" />
                ) : (
                  <Circle className="icon-pending" />
                )}
              </button>

              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  <span className="meta-item">
                    <Tag size={12} />
                    {task.category}
                  </span>
                  <span className="meta-item">
                    <Calendar size={12} />
                    {task.due_date}
                  </span>
                </div>
              </div>

              <button className="delete-button" onClick={() => handleDelete(task)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tareas;
