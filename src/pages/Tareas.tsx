import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Circle, 
  CheckCircle2,
  Calendar,
  Flag,
  Trash2,
  Layout as BoardIcon,
  List as ListIcon,
  Brain
} from 'lucide-react';
import { TaskService } from '../services/TaskService';
import './Tareas.css';

const Tareas: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState(1);
  const [category, setCategory] = useState('General');
  const [cognitiveLoad, setCognitiveLoad] = useState('media');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const loadTasks = async () => {
    try {
      const data = await TaskService.getActiveTasks();
      // Sort: Pending first, then by priority (desc), then by created_at (desc)
      const sorted = [...data].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
        if (a.priority !== b.priority) return b.priority - a.priority;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setTasks(sorted);
    } catch (err) {
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await TaskService.addTask(newTaskTitle, priority, category, undefined, dueDate, cognitiveLoad);
      setNewTaskTitle('');
      setPriority(1);
      setCategory('General');
      setDueDate(new Date().toISOString().split('T')[0]);
      setIsAdding(false);
      loadTasks();
    } catch (err) {
      alert(err);
    }
  };

  const handleToggle = async (task: any) => {
    await TaskService.toggleTaskStatus(task);
    loadTasks();
  };

  const handleDelete = async (task: any) => {
    if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
      await TaskService.removeTask(task.id, task.uuid, task.title);
      loadTasks();
    }
  };

  const getPriorityLabel = (p: number) => {
    if (p === 3) return 'Alta';
    if (p === 2) return 'Media';
    return 'Baja';
  };

  const setQuickDate = (type: 'today' | 'tomorrow' | 'nextWeek') => {
    const date = new Date();
    if (type === 'tomorrow') date.setDate(date.getDate() + 1);
    if (type === 'nextWeek') date.setDate(date.getDate() + 7);
    setDueDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="tareas-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Mis Tareas</h1>
          <p>{tasks.filter(t => t.status === 'pending').length} tareas pendientes para hoy</p>
        </div>
        <div className="header-actions">
          <div className="view-mode-toggle">
            <button 
              onClick={() => setViewMode('list')} 
              className={viewMode === 'list' ? 'active' : ''}
              title="Vista de Lista"
            >
              <ListIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('board')} 
              className={viewMode === 'board' ? 'active' : ''}
              title="Vista de Tablero"
            >
              <BoardIcon size={18} />
            </button>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="btn-fab-desktop">
              <Plus size={20} />
              <span>Añadir Tarea</span>
            </button>
          )}
        </div>
      </header>

      {isAdding && (
        <div className="task-creator-card animate-slide-up">
          <form onSubmit={handleAddTask}>
            <input 
              type="text" 
              placeholder="¿Qué tienes en mente?" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="creator-input"
              autoFocus
            />
            
            <div className="creator-options">
              <div className="option-group">
                <label><Flag size={14} /> Prioridad</label>
                <div className="priority-selector">
                  {[1, 2, 3].map(p => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`priority-btn p${p} ${priority === p ? 'active' : ''}`}
                    >
                      {getPriorityLabel(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label><Brain size={14} /> Carga Cognitiva</label>
                <div className="cognitive-selector">
                  {['baja', 'media', 'alta'].map(load => (
                    <button 
                      key={load}
                      type="button"
                      onClick={() => setCognitiveLoad(load)}
                      className={`load-btn ${load} ${cognitiveLoad === load ? 'active' : ''}`}
                    >
                      {load}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label><Calendar size={14} /> Fecha</label>
                <div className="date-quick-picks">
                  <button type="button" onClick={() => setQuickDate('today')} className={dueDate === new Date().toISOString().split('T')[0] ? 'active' : ''}>Hoy</button>
                  <button type="button" onClick={() => setQuickDate('tomorrow')}>Mañana</button>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
            </div>

            <div className="creator-actions">
              <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTaskTitle.trim()}>
                Crear Tarea
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="task-content-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Organizando tu día...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <CheckCircle2 size={64} strokeWidth={1} />
            </div>
            <h2>Todo despejado</h2>
            <p>No tienes tareas pendientes. Aprovecha para descansar o planear tu siguiente meta.</p>
            <button onClick={() => setIsAdding(true)} className="btn-secondary">Crear mi primera tarea</button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task.id} className={`task-card-premium ${task.status} p${task.priority}`}>
                <div className="task-main">
                  <button onClick={() => handleToggle(task)} className="task-status-check">
                    {task.status === 'completed' ? (
                      <div className="checked-icon"><CheckCircle2 size={24} /></div>
                    ) : (
                      <div className="unchecked-icon"><Circle size={24} /></div>
                    )}
                  </button>
                  
                  <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-tags">
                      <span className={`priority-indicator p${task.priority}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className="load-tag" data-load={task.cognitive_load || 'media'}>
                        <Brain size={12} /> {task.cognitive_load || 'media'}
                      </span>
                      {task.due_date && (
                        <span className="date-tag">
                          <Calendar size={12} /> {task.due_date === new Date().toISOString().split('T')[0] ? 'Hoy' : task.due_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="task-actions-menu">
                    <button onClick={() => handleDelete(task)} className="action-btn delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tasks-board">
            {[
              { id: 'pending', title: 'Por Hacer' },
              { id: 'in_progress', title: 'En Proceso' },
              { id: 'completed', title: 'Finalizado' }
            ].map(column => (
              <div key={column.id} className="board-column">
                <div className="column-header">
                  <h3>{column.title}</h3>
                  <span className="count">{tasks.filter(t => (column.id === 'pending' ? t.status === 'pending' : t.status === column.id)).length}</span>
                </div>
                <div className="column-tasks">
                  {tasks
                    .filter(t => (column.id === 'pending' ? t.status === 'pending' : t.status === column.id))
                    .map(task => (
                      <div key={task.id} className={`board-task-card p${task.priority}`}>
                        <div className="task-header-mini">
                          <span className="load-dot" data-load={task.cognitive_load || 'media'}></span>
                          <span className="priority-line"></span>
                        </div>
                        <h4>{task.title}</h4>
                        <div className="task-footer-mini">
                           <span className="date-mini">{task.due_date?.split('-').slice(1).join('/')}</span>
                           <button onClick={() => handleToggle(task)} className="btn-toggle-mini">
                             {task.status === 'completed' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                           </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="fab-mobile">
          <Plus size={28} />
        </button>
      )}
    </div>
  );
};

export default Tareas;
