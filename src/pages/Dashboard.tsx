import React from 'react';
import { 
  Zap, 
  Target, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container animate-fade">
      <header className="dashboard-header" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>
          Hola, David <span style={{ color: 'hsl(var(--brand))' }}>⚡</span>
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>
          Tu energía actual es óptima para tareas de enfoque profundo.
        </p>
      </header>

      <div className="metrics-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-2xl)'
      }}>
        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <Zap style={{ color: 'hsl(var(--brand))' }} />
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--success))' }}>+12% vs ayer</span>
          </div>
          <h3 style={{ fontSize: '1.8rem' }}>84</h3>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>Enfoque ESP</p>
        </div>

        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <CheckCircle2 style={{ color: 'hsl(var(--success))' }} />
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>5 de 8</span>
          </div>
          <h3 style={{ fontSize: '1.8rem' }}>62%</h3>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>Tareas Completadas</p>
        </div>

        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <Target style={{ color: 'hsl(var(--warning))' }} />
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>2 activos</span>
          </div>
          <h3 style={{ fontSize: '1.8rem' }}>Ciclo 4</h3>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>Temporada de Crecimiento</p>
        </div>
      </div>

      <div className="dashboard-sections" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: 'var(--space-2xl)' 
      }}>
        <section className="focus-section">
          <h2 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Clock size={24} style={{ color: 'hsl(var(--brand))' }} />
            Enfoque del Día
          </h2>
          <div className="premium-card" style={{ padding: '0' }}>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ padding: 'var(--space-lg)', borderBottom: '1px solid hsla(var(--text-primary), 0.05)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'hsl(var(--danger))' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem' }}>Finalizar arquitectura DMG03</h4>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Prioridad Crítica • 2h estimadas</p>
                </div>
                <ArrowRight size={18} style={{ color: 'hsl(var(--text-muted))' }} />
              </li>
              <li style={{ padding: 'var(--space-lg)', borderBottom: '1px solid hsla(var(--text-primary), 0.05)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'hsl(var(--warning))' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem' }}>Configurar Service Workers</h4>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Técnico • PWA</p>
                </div>
                <ArrowRight size={18} style={{ color: 'hsl(var(--text-muted))' }} />
              </li>
            </ul>
          </div>
        </section>

        <section className="activity-section">
          <h2 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <TrendingUp size={24} style={{ color: 'hsl(var(--success))' }} />
            Tendencia Semanal
          </h2>
          <div className="premium-card chart-card">
            <div className="chart-container">
              {[40, 70, 45, 90, 65, 80, 85].map((h, i) => (
                <div key={i} className="chart-bar-wrapper">
                  <div className="chart-bar-tooltip">{h}%</div>
                  <div 
                    className={`chart-bar ${i === 6 ? 'active' : ''}`} 
                    style={{ height: `${h}%` }}
                  />
                  <span className="chart-day-label">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-grid">
              <div className="grid-line" style={{ bottom: '25%' }}></div>
              <div className="grid-line" style={{ bottom: '50%' }}></div>
              <div className="grid-line" style={{ bottom: '75%' }}></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
