import React, { useState } from 'react';
import { 
  Wind, 
  Moon, 
  Brain, 
  Heart, 
  Music, 
  Play, 
  Zap, 
  Plus,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import './Santuario.css';

const Santuario: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [isJournaling, setIsJournaling] = useState(false);

  const meditations = [
    { title: 'Claridad Matinal', duration: '5 min', icon: <Zap size={20} />, color: 'blue' },
    { title: 'Reset de Ansiedad', duration: '3 min', icon: <Heart size={20} />, color: 'orange' },
    { title: 'Foco Profundo', duration: '10 min', icon: <Brain size={20} />, color: 'purple' },
    { title: 'Paz Nocturna', duration: '15 min', icon: <Moon size={20} />, color: 'navy' },
  ];

  return (
    <div className="santuario-view animate-fade">
      <header className="view-header">
        <div>
          <h1>El Santuario</h1>
          <p className="subtitle">Tu espacio sagrado para recuperar el equilibrio.</p>
        </div>
        {!isJournaling && (
          <button className="fab-button" onClick={() => setIsJournaling(true)}>
            <Sparkles size={20} />
            <span>Vaciar Mente</span>
          </button>
        )}
      </header>

      {isJournaling && (
        <div className="creator-card premium-card animate-fade">
          <textarea 
            autoFocus
            className="journal-textarea"
            placeholder="¿Qué tienes en la mente ahora mismo? Suéltalo aquí sin juicio..."
          />
          <div className="creator-actions-footer">
            <button className="btn-ghost" onClick={() => setIsJournaling(false)}>Cancelar</button>
            <button className="btn-primary" onClick={() => setIsJournaling(false)}>Guardar Reflexión</button>
          </div>
        </div>
      )}

      <div className="santuario-grid">
        {/* Breathing Exercise */}
        <section className={`breathing-box premium-card ${isBreathing ? 'active' : ''}`}>
           <div className="breathing-content">
              <div className="breathing-header">
                 <Wind className="icon-pulse" />
                 <div>
                    <h3>Respiración Consciente</h3>
                    <p>Inhala paz, exhala tensión. Método 4-4-4.</p>
                 </div>
              </div>
              <button 
                className={`btn-breathing ${isBreathing ? 'stop' : 'start'}`}
                onClick={() => setIsBreathing(!isBreathing)}
              >
                {isBreathing ? 'Detener' : 'Iniciar'}
              </button>
           </div>
           
           {isBreathing && (
             <div className="breathing-viz">
                <div className="breathing-circle-outer">
                   <div className="breathing-circle-inner"></div>
                </div>
                <span className="breathing-label">Respira...</span>
             </div>
           )}
        </section>

        {/* Meditation Library */}
        <section className="meditation-library-card">
           <div className="section-title-sm">
              <Music size={18} />
              <h2>Micro-meditaciones</h2>
           </div>
           <div className="meditation-list">
              {meditations.map((med, i) => (
                <div key={i} className="meditation-card premium-card">
                   <div className="med-icon-box">{med.icon}</div>
                   <div className="med-info">
                      <h4>{med.title}</h4>
                      <span>{med.duration}</span>
                   </div>
                   <button className="play-btn">
                      <Play size={14} fill="currentColor" />
                   </button>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Stress Meter */}
      <section className="stress-meter premium-card">
         <div className="card-header">
            <Zap size={20} className="icon-brand" />
            <h2>Carga Cognitiva Actual</h2>
         </div>
         <div className="meter-container">
            <div className="meter-track">
               <div className="meter-fill" style={{ width: '28%' }}></div>
            </div>
            <div className="meter-labels">
               <span>Baja</span>
               <span className="active">Óptima</span>
               <span>Sobrecarga</span>
            </div>
         </div>
         <p className="meter-hint">Tu cerebro está en condiciones ideales para trabajo creativo.</p>
      </section>
    </div>
  );
};

export default Santuario;
