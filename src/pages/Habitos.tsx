import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Heart, 
  Zap, 
  Shield, 
  Sparkles, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { HabitService } from '../services/HabitService';
import type { Habit } from '../services/HabitService';
import './Habitos.css';

interface HabitDisplay extends Habit {
  completed_today: boolean;
}

const Habitos: React.FC = () => {
  const [habits, setHabits] = useState<HabitDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatorOpen, setCreatorOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Salud');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allHabits, todayLogs] = await Promise.all([
        HabitService.getAll(),
        HabitService.getTodayLogs()
      ]);

      setHabits(allHabits.map(h => ({
        ...h,
        completed_today: todayLogs.has(h.id)
      })));
    } catch (error) {
      console.error('Error loadData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await HabitService.addHabit(newTitle, newCategory);
      setNewTitle('');
      setCreatorOpen(false);
      loadData();
    } catch (error) {
      console.error('Error handleAdd:', error);
    }
  };

  const handleToggle = async (habit: HabitDisplay) => {
    try {
      await HabitService.toggleToday(habit.id, habit.completed_today);
      loadData();
    } catch (error) {
      console.error('Error handleToggle:', error);
    }
  };

  const handleDelete = async (habit: Habit) => {
    if (!confirm('¿Eliminar este hábito?')) return;
    try {
      await HabitService.deleteHabit(habit);
      loadData();
    } catch (error) {
      console.error('Error handleDelete:', error);
    }
  };

  const categories = [
    { name: 'Salud', icon: <Heart size={14} />, color: 'hsl(0, 84%, 60%)' },
    { name: 'Energía', icon: <Zap size={14} />, color: 'hsl(38, 92%, 50%)' },
    { name: 'Mente', icon: <Shield size={14} />, color: 'hsl(var(--brand))' },
    { name: 'Enfoque', icon: <Sparkles size={14} />, color: 'hsl(280, 80%, 65%)' }
  ];

  return (
    <div className="habitos-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Hábitos Diarios</h1>
          <p className="subtitle">La disciplina es el puente entre metas y logros.</p>
        </div>
        {!isCreatorOpen && (
          <button className="fab-button" onClick={() => setCreatorOpen(true)}>
            <Plus size={24} />
            <span>Nuevo Hábito</span>
          </button>
        )}
      </header>

      {isCreatorOpen && (
        <div className="creator-card premium-card animate-fade">
          <form onSubmit={handleAdd}>
            <input 
              autoFocus
              className="creator-input"
              placeholder="¿Qué nuevo hábito quieres cultivar?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            
            <div className="category-selector-group">
              <span className="group-label">Selecciona una categoría</span>
              <div className="category-chips">
                {categories.map(cat => (
                  <button 
                    key={cat.name}
                    type="button"
                    className={`cat-chip ${newCategory === cat.name ? 'active' : ''}`}
                    style={{ '--cat-color': cat.color } as any}
                    onClick={() => setNewCategory(cat.name)}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="creator-actions-footer">
              <button type="button" className="btn-ghost" onClick={() => setCreatorOpen(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>
                <Sparkles size={16} />
                Empezar Hábito
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="habits-grid">
        {loading ? (
          <div className="loading-state">Analizando consistencia...</div>
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <Zap size={48} />
            <p>Aún no tienes hábitos registrados. Comienza uno hoy.</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className={`habit-card premium-card ${habit.completed_today ? 'completed' : ''}`}>
              <button className="habit-check-btn" onClick={() => handleToggle(habit)}>
                {habit.completed_today ? (
                  <div className="check-blob active">
                    <CheckCircle2 size={24} />
                  </div>
                ) : (
                  <div className="check-blob">
                    <Circle size={24} />
                  </div>
                )}
              </button>

              <div className="habit-info">
                <h3>{habit.title}</h3>
                <span className="habit-tag">{habit.category}</span>
              </div>

              <div className="habit-actions">
                <button className="delete-btn" onClick={() => handleDelete(habit)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Habitos;
