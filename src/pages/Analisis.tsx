import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Brain, 
  Zap, 
  Clock, 
  History,
  TrendingUp,
  Award
} from 'lucide-react';
import { ActivityService } from '../services/ActivityService';
import { getPerformanceMetrics } from '../lib/metricsEngine';
import './Analisis.css';

const Analisis: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'logs'>('insights');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [m, l] = await Promise.all([
          getPerformanceMetrics(),
          ActivityService.getRecentActivity(30)
        ]);
        setMetrics(m);
        setLogs(l);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading-state">Analizando tu rendimiento profundo...</div>;

  return (
    <div className="analisis-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Análisis de Rendimiento</h1>
          <p>Métricas avanzadas y auditoría de tu evolución personal.</p>
        </div>
        <div className="tab-switcher">
          <button 
            className={activeTab === 'insights' ? 'active' : ''} 
            onClick={() => setActiveTab('insights')}
          >
            <TrendingUp size={16} /> Insights
          </button>
          <button 
            className={activeTab === 'logs' ? 'active' : ''} 
            onClick={() => setActiveTab('logs')}
          >
            <History size={16} /> Auditoría
          </button>
        </div>
      </header>

      {activeTab === 'insights' ? (
        <div className="insights-content">
          <div className="metrics-hero-grid">
            <div className="metric-hero-card brand">
              <div className="hero-icon"><Award size={32} /></div>
              <div className="hero-info">
                <span className="label">Disciplina Global</span>
                <span className="value">{metrics?.disciplineIndex}%</span>
              </div>
              <div className="hero-progress">
                <div className="bar"><div className="fill" style={{ width: `${metrics?.disciplineIndex}%` }}></div></div>
              </div>
            </div>
            <div className="metric-hero-card success">
              <div className="hero-icon"><Zap size={32} /></div>
              <div className="hero-info">
                <span className="label">Velocidad de Ejecución</span>
                <span className="value">{metrics?.executionVelocity}%</span>
              </div>
              <div className="hero-progress">
                <div className="bar"><div className="fill" style={{ width: `${metrics?.executionVelocity}%` }}></div></div>
              </div>
            </div>
          </div>

          <div className="analysis-grid">
            <section className="chart-card">
              <div className="section-header">
                <Brain size={20} className="icon-accent" />
                <h3>Balance Cognitivo</h3>
              </div>
              <div className="energy-flow-visual">
                <p className="description">Correlación entre carga de tareas y energía disponible.</p>
                <div className="energy-meter-large">
                  <div className="meter-ring">
                    <div className="meter-value" style={{ '--val': metrics?.estimatedEnergy } as any}>
                      <span>{metrics?.estimatedEnergy}%</span>
                      <small>Energía Promedio</small>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="chart-card">
              <div className="section-header">
                <Activity size={20} className="icon-accent" />
                <h3>Distribución de Foco</h3>
              </div>
              <div className="focus-breakdown">
                {[
                  { label: 'Enfoque Profundo', value: 65, color: 'hsl(195, 85%, 50%)' },
                  { label: 'Gestión', value: 20, color: 'hsl(215, 25%, 30%)' },
                  { label: 'Recuperación', value: 15, color: 'hsl(150, 60%, 45%)' }
                ].map(item => (
                  <div key={item.label} className="focus-item">
                    <div className="focus-label">
                      <span className="dot" style={{ backgroundColor: item.color }}></span>
                      <span>{item.label}</span>
                    </div>
                    <span className="focus-val">{item.value}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="summary-analysis">
             <div className="ai-report-card">
                <div className="ai-badge">IA ANALYSIS</div>
                <h3>Diagnóstico de la IA FNix</h3>
                <p>
                  Tu disciplina ha subido un <strong>12%</strong> respecto a la semana pasada. 
                  Sin embargo, detectamos una caída de energía sistemática los jueves por la tarde. 
                  Recomendamos programar sesiones de <strong>Zen Rest</strong> proactivas en ese bloque para evitar el burnout.
                </p>
             </div>
          </section>
        </div>
      ) : (
        <div className="audit-logs-content">
          <div className="activity-timeline">
            {logs.map((log, i) => (
              <div key={log.id} className="activity-item-premium">
                <div className="activity-icon-container">
                  <div className={`activity-dot ${log.action}`}></div>
                  {i !== logs.length - 1 && <div className="activity-line"></div>}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-action">{log.details}</span>
                    <span className="activity-time">
                      <Clock size={12} />
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analisis;
