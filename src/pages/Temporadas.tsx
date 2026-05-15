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
import { SeasonService } from '../services/SeasonService';
import type { Season } from '../services/SeasonService';
import './Temporadas.css';

const Temporadas: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatorOpen, setCreatorOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newTheme, setNewTheme] = useState('Disciplina');

  useEffect(() => {
    loadSeasons();
  }, []);

  const loadSeasons = async () => {
    try {
      const data = await SeasonService.getAll();
      setSeasons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await SeasonService.startNewSeason(newTitle, newTheme);
      setNewTitle('');
      setCreatorOpen(false);
      loadSeasons();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar registro del ciclo?')) return;
    try {
      await SeasonService.deleteSeason(id);
      loadSeasons();
    } catch (error) {
      console.error(error);
    }
  };

  const themes = [
    { name: 'Disciplina', icon: <Zap size={14} /> },
    { name: 'Salud', icon: <Wind size={14} /> },
    { name: 'Trabajo', icon: <Target size={14} /> },
    { name: 'Desarrollo', icon: <BookOpen size={14} /> },
    { name: 'Específico', icon: <Sparkles size={14} /> }
  ];

  return (
    <div className="seasons-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Ciclos Estratégicos</h1>
          <p className="subtitle">Divide tu año en periodos de enfoque de 30 días.</p>
        </div>
        {!isCreatorOpen && (
          <button className="fab-button" onClick={() => setCreatorOpen(true)}>
            <Plus size={24} />
            <span>Nuevo Ciclo</span>
          </button>
        )}
      </header>

      {isCreatorOpen && (
        <div className="creator-card premium-card animate-fade">
          <form onSubmit={handleStart}>
            <input 
              autoFocus
              className="creator-input"
              placeholder="Nombre del nuevo ciclo..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            
            <div className="theme-selector-group">
              <span className="group-label">Eje Temático del Ciclo</span>
              <div className="category-chips">
                {themes.map(t => (
                  <button 
                    key={t.name}
                    type="button"
                    className={`cat-chip ${newTheme === t.name ? 'active' : ''}`}
                    onClick={() => setNewTheme(t.name)}
                  >
                    {t.icon}
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="creator-actions-footer">
              <button type="button" className="btn-ghost" onClick={() => setCreatorOpen(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>
                <Sparkles size={16} />
                Iniciar Ciclo
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="seasons-grid">
        {loading ? (
          <div className="loading-state">Calculando cronología...</div>
        ) : seasons.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} strokeWidth={1} />
            <p>Define tu primer ciclo para empezar a medir tu evolución.</p>
          </div>
        ) : (
          seasons.map(s => (
            <div key={s.id} className={`season-card premium-card ${s.status}`}>
              <div className="season-top">
                <span className={`status-pill ${s.status}`}>
                  {s.status === 'active' ? 'EN CURSO' : 'FINALIZADO'}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(s.id)}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="season-content">
                <div className="theme-orb">
                   <Target size={20} />
                </div>
                <div>
                  <span className="theme-label">{s.theme}</span>
                  <h3 className="season-title">{s.title}</h3>
                </div>
              </div>

              <div className="season-footer">
                <div className="date-range">
                   <Calendar size={14} />
                   <span>{s.start_date} — {s.end_date}</span>
                </div>
                {s.status === 'active' && <ArrowRight size={20} className="active-glow" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Temporadas;
