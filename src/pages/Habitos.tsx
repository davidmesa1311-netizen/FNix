import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Heart, Zap, Shield, Sparkles, Trash2 } from 'lucide-react';
import { getHabits, createHabit, supabase } from '../db/db';
import './Habitos.css';

interface Habit {
  id: number;
  title: string;
  completed_today: boolean;
  category: string;
}

const Habitos: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState('Salud');

  const loadHabits = async () => {
    const habitsData = await getHabits();
    const today = new Date().toISOString().split('T')[0];
    const { data: logs } = await supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('completed_at', today);

    const completedIds = new Set((logs || []).map((l: any) => l.habit_id));

    setHabits(habitsData.map((h: any) => ({
      id: h.id,
      title: h.title,
      category: h.category,
      completed_today: completedIds.has(h.id)
    })));
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createHabit({ title: newTitle, category });
    setNewTitle('');
    setIsAdding(false);
    loadHabits();
  };

  const toggleHabit = async (habitId: number, completed: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    if (completed) {
      await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_at', today);
    } else {
      await supabase
        .from('habit_logs')
        .insert({ habit_id: habitId, completed_at: today });
    }
    loadHabits();
  };

  const handleDeleteHabit = async (id: number, title: string) => {
    if (window.confirm(`¿Eliminar el hábito "${title}"?`)) {
      await supabase.from('habits').delete().eq('id', id);
      loadHabits();
    }
  };

  const categories = [
    { name: 'Salud', icon: <Heart size={14} /> },
    { name: 'Energía', icon: <Zap size={14} /> },
    { name: 'Mente', icon: <Shield size={14} /> },
    { name: 'Enfoque', icon: <Sparkles size={14} /> }
  ];

  return (
    <div className="habitos-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Hábitos Diarios</h1>
          <p>La constancia es la clave del alto rendimiento.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-fab">
            <Plus size={20} />
            <span>Nuevo Hábito</span>
          </button>
        )}
      </header>

      {isAdding && (
        <div className="creator-card animate-slide-up">
          <form onSubmit={handleAddHabit}>
            <input 
              type="text" 
              placeholder="¿Qué hábito quieres cultivar?" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              className="creator-title-input"
              autoFocus
            />
            
            <div className="category-selector">
              <span className="input-label">Categoría</span>
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
              <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>Crear Hábito</button>
            </div>
          </form>
        </div>
      )}

      <div className="habits-grid">
        {habits.map(habit => (
          <div key={habit.id} className={`habit-card-premium ${habit.completed_today ? 'completed' : ''}`}>
            <div className="habit-main">
              <button 
                onClick={() => toggleHabit(habit.id, habit.completed_today)}
                className="habit-check-btn"
              >
                {habit.completed_today ? (
                  <div className="check-inner active"><CheckCircle2 size={28} /></div>
                ) : (
                  <div className="check-inner"><Circle size={28} /></div>
                )}
              </button>
              
              <div className="habit-content">
                <h3>{habit.title}</h3>
                <span className="habit-category-tag">{habit.category}</span>
              </div>

              <button onClick={() => handleDeleteHabit(habit.id, habit.title)} className="habit-delete-btn">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Habitos;
