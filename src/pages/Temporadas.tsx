import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Wind,
  Zap,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { supabase } from '../db/db';
import './Temporadas.css';

interface Season {
  id: number;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  status: string;
}

const Temporadas: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTheme, setNewTheme] = useState('Disciplina');
  
  const themes = [
    { name: 'Disciplina', icon: <Zap size={14} /> },
    { name: 'Salud', icon: <Wind size={14} /> },
    { name: 'Trabajo', icon: <Target size={14} /> },
    { name: 'Desarrollo', icon: <BookOpen size={14} /> },
    { name: 'Específico', icon: <Sparkles size={14} /> }
  ];

  const loadSeasons = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('seasons')
        .select('*')
        .order('start_date', { ascending: false });
      
      setSeasons((data || []).map((s: any) => ({
        id: s.id, title: s.title, theme: s.theme, start_date: s.start_date, end_date: s.end_date, status: s.status
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    // Marcar otras como completadas
    await supabase
      .from('seasons')
      .update({ status: 'completed' })
      .eq('status', 'active');

    // Crear nueva
    await supabase
      .from('seasons')
      .insert({ 
        title: newTitle, 
        theme: newTheme, 
        start_date: today, 
        end_date: nextMonth 
      });

    setNewTitle('');
    setIsAdding(false);
    loadSeasons();
  };

  const handleDeleteSeason = async (id: number, title: string) => {
    if (window.confirm(`¿Eliminar el registro del ciclo "${title}"?`)) {
      await supabase.from('seasons').delete().eq('id', id);
      loadSeasons();
    }
  };

  return (
    <div className="seasons-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Ciclos Estratégicos</h1>
          <p>Divide tu año en periodos de enfoque intenso.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-fab">
            <Plus size={20} />
            <span>Nuevo Ciclo</span>
          </button>
        )}
      </header>

      {isAdding && (
        <div className="creator-card animate-slide-up">
          <form onSubmit={handleAddSeason}>
            <input 
              type="text" 
              placeholder="Nombre del ciclo (ej. Sprint de Primavera)" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="creator-title-input"
              autoFocus
            />
            
            <div className="category-selector">
              <span className="input-label">Eje Temático</span>
              <div className="category-chips">
                {themes.map(t => (
                  <button 
                    key={t.name} type="button" 
                    className={`category-chip ${newTheme === t.name ? 'active' : ''}`}
                    onClick={() => setNewTheme(t.name)}
                  >
                    {t.icon}
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="creator-actions">
              <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>Iniciar Ciclo</button>
            </div>
          </form>
        </div>
      )}

      <div className="seasons-grid-premium">
        {loading ? (
          <div className="loading-state">Cargando cronología...</div>
        ) : seasons.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} strokeWidth={1} />
            <h2>Sin ciclos activos</h2>
            <p>Define tu primer ciclo para empezar a medir tu evolución.</p>
          </div>
        ) : (
          seasons.map(s => (
            <div key={s.id} className={`season-card-premium ${s.status}`}>
              <div className="season-card-top">
                <div className={`status-pill ${s.status}`}>
                  {s.status === 'active' ? 'EN CURSO' : 'FINALIZADO'}
                </div>
                <button onClick={() => handleDeleteSeason(s.id, s.title)} className="season-delete-btn">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="season-main">
                <div className="theme-icon-container">
                  <Wind size={20} />
                </div>
                <div className="season-details">
                  <span className="season-theme-label">{s.theme}</span>
                  <h3>{s.title}</h3>
                </div>
              </div>

              <div className="season-footer">
                <div className="season-timeline">
                  <Calendar size={14} />
                  <span>{s.start_date} — {s.end_date}</span>
                </div>
                {s.status === 'active' && <ArrowRight size={18} className="active-arrow" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Temporadas;
