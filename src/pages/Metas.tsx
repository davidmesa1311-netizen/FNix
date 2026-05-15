import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Target as TargetIcon, 
  Trash2, 
  Award, 
  Briefcase, 
  User, 
  Star,
  Sparkles,
  Calendar
} from 'lucide-react';
import { GoalService } from '../services/GoalService';
import type { Goal } from '../services/GoalService';
import './Metas.css';

const Metas: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatorOpen, setCreatorOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await GoalService.getAll();
      setGoals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await GoalService.addGoal({
        title: newTitle,
        category: newCategory,
        target_date: newDate || null
      });
      setNewTitle('');
      setCreatorOpen(false);
      loadGoals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (goal: Goal) => {
    if (!confirm('¿Eliminar esta meta?')) return;
    try {
      await GoalService.deleteGoal(goal);
      loadGoals();
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    { name: 'Personal', icon: <User size={14} /> },
    { name: 'Trabajo', icon: <Briefcase size={14} /> },
    { name: 'Salud', icon: <Award size={14} /> },
    { name: 'Estratégico', icon: <Star size={14} /> }
  ];

  return (
    <div className="metas-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Metas Estratégicas</h1>
          <p className="subtitle">Define tu visión y traza el camino hacia ella.</p>
        </div>
        {!isCreatorOpen && (
          <button className="fab-button" onClick={() => setCreatorOpen(true)}>
            <Plus size={24} />
            <span>Nueva Meta</span>
          </button>
        )}
      </header>

      {isCreatorOpen && (
        <div className="creator-card premium-card animate-fade">
          <form onSubmit={handleAdd}>
            <input 
              autoFocus
              className="creator-input"
              placeholder="Define tu gran objetivo..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            
            <div className="creator-meta-group">
              <div className="cat-selector">
                <span className="group-label">Área de Vida</span>
                <div className="category-chips">
                  {categories.map(cat => (
                    <button 
                      key={cat.name}
                      type="button"
                      className={`cat-chip ${newCategory === cat.name ? 'active' : ''}`}
                      onClick={() => setNewCategory(cat.name)}
                    >
                      {cat.icon}
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="date-input-group">
                <span className="group-label">Fecha Objetivo</span>
                <div className="date-field">
                  <Calendar size={18} />
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="creator-actions-footer">
              <button type="button" className="btn-ghost" onClick={() => setCreatorOpen(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>
                <TargetIcon size={16} />
                Fijar Meta
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="goals-grid">
        {loading ? (
          <div className="loading-state">Visualizando el futuro...</div>
        ) : goals.length === 0 ? (
          <div className="empty-state">
            <TargetIcon size={48} />
            <p>Define tu primera meta para empezar a construir.</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card premium-card">
              <div className="goal-header">
                <span className="goal-badge">{goal.category}</span>
                <button className="delete-btn" onClick={() => handleDelete(goal)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="goal-title">{goal.title}</h3>
              {goal.target_date && (
                <div className="goal-deadline">
                  <Calendar size={14} />
                  <span>Para el {new Date(goal.target_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="goal-footer">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <span className="progress-text">0% completado</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Metas;
