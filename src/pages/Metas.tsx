import React, { useState, useEffect } from 'react';
import { Plus, Target as TargetIcon, Trash2, Award, Briefcase, User, Star } from 'lucide-react';
import { getGoals, createGoal, getGoalProgress, supabase } from '../db/db';
import './Metas.css';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
}

const Metas: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [category, setCategory] = useState('Personal');

  const loadGoals = async () => {
    setLoading(true);
    try {
      const data = await getGoals();
      const enrichedGoals = await Promise.all(data.map(async (g: any) => {
        const prog = await getGoalProgress(g.id);
        const taskRatio = prog.tasks.total > 0 ? (prog.tasks.completed / prog.tasks.total) : 0;
        return {
          id: g.id,
          title: g.title,
          description: g.description || '',
          category: g.category || 'General',
          progress: Math.round(taskRatio * 100)
        };
      }));
      setGoals(enrichedGoals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createGoal({ 
      title: newTitle, 
      description: newDesc,
      category 
    });
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
    loadGoals();
  };

  const handleDeleteGoal = async (id: number, title: string) => {
    if (window.confirm(`¿Eliminar la meta "${title}"? Esto no borrará las tareas asociadas.`)) {
      await supabase.from('goals').delete().eq('id', id);
      loadGoals();
    }
  };

  const categories = [
    { name: 'Personal', icon: <User size={14} /> },
    { name: 'Trabajo', icon: <Briefcase size={14} /> },
    { name: 'Salud', icon: <Award size={14} /> },
    { name: 'Proyectos', icon: <Star size={14} /> }
  ];

  return (
    <div className="metas-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Metas Estratégicas</h1>
          <p>Define tu visión a largo plazo y mide tu avance real.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-fab">
            <Plus size={20} />
            <span>Nueva Meta</span>
          </button>
        )}
      </header>

      {isAdding && (
        <div className="creator-card animate-slide-up">
          <form onSubmit={handleAddGoal}>
            <input 
              type="text" 
              placeholder="¿Qué quieres lograr?" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              className="creator-title-input"
              autoFocus
            />
            <textarea 
              placeholder="Describe brevemente el impacto de esta meta..." 
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="creator-desc-input"
            />
            
            <div className="category-selector">
              <span className="input-label">Eje Estratégico</span>
              <div className="category-chips">
                {categories.map(cat => (
                  <button 
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`category-chip ${category === cat.name ? 'active' : ''}`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="creator-actions">
              <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>Establecer Meta</button>
            </div>
          </form>
        </div>
      )}

      <div className="goals-grid-premium">
        {loading ? (
          <div className="loading-state">Calculando progresos...</div>
        ) : goals.length === 0 ? (
          <div className="empty-state">
            <TargetIcon size={64} strokeWidth={1} />
            <h2>Sin metas activas</h2>
            <p>Define tu primer gran objetivo para empezar a trackear tu progreso.</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card-premium">
              <div className="goal-card-header">
                <div className="goal-icon-bg">
                  <TargetIcon size={20} />
                </div>
                <div className="goal-header-text">
                  <span className="goal-category">{goal.category}</span>
                  <h3>{goal.title}</h3>
                </div>
                <button onClick={() => handleDeleteGoal(goal.id, goal.title)} className="goal-delete-btn">
                  <Trash2 size={16} />
                </button>
              </div>

              {goal.description && <p className="goal-desc">{goal.description}</p>}

              <div className="goal-progress-section">
                <div className="progress-info">
                  <span>Progreso Real</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Metas;
