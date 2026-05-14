import React, { useState } from 'react';
import { 
  Wind, 
  Moon, 
  Brain, 
  Heart, 
  Music, 
  Play, 
  Zap, 
  Plus
} from 'lucide-react';
import './Santuario.css';

const Santuario: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [isAddingJournal, setIsAddingJournal] = useState(false);

  const meditations = [
    { title: 'Claridad Matinal', duration: '5 min', icon: <Zap size={20} />, color: 'blue' },
    { title: 'Reset de Ansiedad', duration: '3 min', icon: <Heart size={20} />, color: 'orange' },
    { title: 'Foco Profundo', duration: '10 min', icon: <Brain size={20} />, color: 'purple' },
    { title: 'Paz Nocturna', duration: '15 min', icon: <Moon size={20} />, color: 'navy' },
  ];

  return (
    <div className="santuario-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>El Santuario</h1>
          <p>Tu espacio para recuperar el equilibrio y reducir la ansiedad.</p>
        </div>
        {!isAddingJournal && (
          <button onClick={() => setIsAddingJournal(true)} className="btn-fab">
            <Plus size={20} />
            <span>Vaciar Mente</span>
          </button>
        )}
      </header>

      {isAddingJournal && (
        <div className="creator-card animate-slide-up">
          <form onSubmit={(e) => { e.preventDefault(); setIsAddingJournal(false); }}>
            <textarea 
              className="creator-title-input" 
              placeholder="¿Qué tienes en la mente ahora mismo? Suéltalo aquí..."
              autoFocus
              style={{ minHeight: '120px', resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <button type="button" className="btn-ghost" onClick={() => setIsAddingJournal(false)}>Cancelar</button>
              <button type="submit" className="btn-primary">Guardar Reflexión</button>
            </div>
          </form>
        </div>
      )}

      <section className="breathing-card">
        <div className="card-content">
          <div className="icon-circle"><Wind size={32} /></div>
          <div className="text-info">
            <h2>Respiración Guiada</h2>
            <p>4 segundos de inhalación, 4 de exhalación. Calma tu sistema nervioso.</p>
          </div>
          <button 
            className={`btn-breathing ${isBreathing ? 'active' : ''}`}
            onClick={() => setIsBreathing(!isBreathing)}
          >
            {isBreathing ? 'Finalizar' : 'Empezar'}
          </button>
        </div>
        {isBreathing && (
          <div className="breathing-animation-container">
            <div className="breathing-circle"></div>
            <span className="breathing-text">Inhala... exhala...</span>
          </div>
        )}
      </section>

      <section className="meditation-library">
        <div className="section-header">
          <Music size={20} className="icon-accent" />
          <h2>Micro-meditaciones</h2>
        </div>
        <div className="meditation-grid">
          {meditations.map((med, i) => (
            <div key={i} className={`meditation-item ${med.color}`}>
              <div className="med-icon">{med.icon}</div>
              <div className="med-info">
                <h3>{med.title}</h3>
                <span>{med.duration}</span>
              </div>
              <button className="btn-play-mini"><Play size={16} fill="currentColor" /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="stress-meter-section">
        <div className="section-header">
          <Zap size={20} className="icon-accent" />
          <h2>Control de Estrés</h2>
        </div>
        <div className="stress-card">
          <p>Tu nivel de estrés actual es <strong>Bajo</strong>. Es un buen momento para tareas creativas.</p>
          <div className="stress-bar"><div className="fill" style={{ width: '25%' }}></div></div>
        </div>
      </section>
    </div>
  );
};

export default Santuario;
