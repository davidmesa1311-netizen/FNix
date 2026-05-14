import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CircleCheck, 
  Target as TargetIcon,
  ArrowRight,
  Sparkles,
  Settings2,
  Activity,
  Wind,
  Layout,
  Maximize2
} from 'lucide-react';
import { 
  getDashboardSummary,
  setSetting
} from '../db/db';
import { 
  fetchAllSettings, 
  fetchCurrentSeason 
} from '../db/queries';
import type { FocusRecommendation } from '../lib/focusEngine';
import { 
  getPerformanceMetrics
} from '../lib/metricsEngine';
import type { PerformanceMetrics } from '../lib/metricsEngine';
import './Dashboard.css';

import WeeklyRhythm from '../components/WeeklyRhythm';
import ZenFocus from '../components/ZenFocus';
import { ActivityService } from '../services/ActivityService';
import { AIPlannerService } from '../services/AIPlannerService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { label: 'Tareas Hoy', value: '0', icon: <Zap size={24} />, color: 'brand' },
    { label: 'Completadas', value: '0', icon: <CircleCheck size={24} />, color: 'success' },
    { label: 'Metas Activas', value: '0', icon: <TargetIcon size={24} />, color: 'warning' },
  ]);
  const [recommendations, setRecommendations] = useState<FocusRecommendation[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [activeSeason, setActiveSeason] = useState<any>(null);
  const [rhythmData, setRhythmData] = useState<{ day: string; count: number }[]>([]);
  const [mode, setMode] = useState('assisted');
  const [viewMode, setViewMode] = useState<'minimal' | 'complete' | 'sanctuary'>('complete');
  const [showZen, setShowZen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const m = await getPerformanceMetrics();
      const [dashData, recs, settings, season, rhythm] = await Promise.all([
        getDashboardSummary(),
        AIPlannerService.getDailyRecommendations(m.estimatedEnergy),
        fetchAllSettings(),
        fetchCurrentSeason(),
        ActivityService.getWeeklyVelocityData()
      ]);
      const perfMetrics = m;

      setStats([
        { label: 'Tareas Hoy', value: String(dashData.tasks?.total || 0), icon: <Zap size={24} />, color: 'brand' },
        { label: 'Completadas', value: String(dashData.tasks?.completed || 0), icon: <CircleCheck size={24} />, color: 'success' },
        { label: 'Metas Activas', value: String(dashData.goals?.active || 0), icon: <TargetIcon size={24} />, color: 'warning' },
      ]);
      setRecommendations(recs);
      setMetrics(perfMetrics);
      setMode(settings.mode || 'assisted');
      setViewMode((settings.view_mode as any) || 'complete');
      setActiveSeason(season);
      setRhythmData(rhythm);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const cycleViewMode = async () => {
    let next: 'minimal' | 'complete' | 'sanctuary' = 'complete';
    if (viewMode === 'complete') next = 'minimal';
    else if (viewMode === 'minimal') next = 'sanctuary';
    else next = 'complete';
    
    await setSetting('view_mode', next);
    setViewMode(next);
  };

  if (loading) return <div className="loading-state">Personalizando tu espacio...</div>;

  // --- VISTA MINIMALISTA (Baja Energía) ---
  if (viewMode === 'minimal') {
    return (
      <div className="dashboard-view minimal animate-fade-in">
        <header className="view-header compact">
          <div className="header-top">
            <span className="date-pill">Modo Diario • Baja Energía</span>
            <button onClick={cycleViewMode} className="view-toggle">
              <Layout size={16} />
              <span>Siguiente Modo</span>
            </button>
          </div>
          <h1 className="minimal-greeting">Un paso a la vez</h1>
          <p className="greeting-sub">Tu energía es baja. Enfoquémonos solo en lo esencial.</p>
        </header>

        {recommendations.length > 0 && (
          <section className="focus-hero-minimal glass-surface">
            <div className="focus-hero-tag">ÚNICA PRIORIDAD</div>
            <h2>{recommendations[0].title}</h2>
            <p>{recommendations[0].reason}</p>
            <button className="btn-primary" onClick={() => setShowZen(true)}>Iniciar Enfoque</button>
          </section>
        )}

        <section className="minimal-progress">
          <div className="progress-label-row">
            <span>Progreso del día</span>
            <span>{Math.round((Number(stats[1].value) / (Number(stats[0].value) || 1)) * 100)}%</span>
          </div>
          <div className="progress-bar-large">
            <div className="fill" style={{ width: `${(Number(stats[1].value) / (Number(stats[0].value) || 1)) * 100}%` }}></div>
          </div>
        </section>
      </div>
    );
  }

  // --- VISTA SANTUARIO (Recuperación) ---
  if (viewMode === 'sanctuary') {
    return (
      <div className="dashboard-view sanctuary animate-fade-in">
        <header className="view-header compact">
          <div className="header-top">
            <span className="date-pill">El Santuario • Recuperación</span>
            <button onClick={cycleViewMode} className="view-toggle">
              <Layout size={16} />
              <span>Volver</span>
            </button>
          </div>
        </header>

        <section className="sanctuary-hero">
          <div className="zen-breathing-logo">
             <Wind size={64} className="breathing-icon" />
          </div>
          <h1>Es momento de recargar</h1>
          <p>Tu energía cognitiva está en niveles críticos. Una pausa ahora multiplicará tu enfoque después.</p>
          
          <div className="sanctuary-actions">
            <button className="btn-secondary" onClick={() => window.location.href='/santuario'}>Sesión de Respiración</button>
            <button className="btn-ghost" onClick={() => setShowZen(true)}>Micro-meditación</button>
          </div>
        </section>
      </div>
    );
  }

  // --- VISTA COMPLETA (MODO NORMAL) ---
  const energyLevel = metrics ? metrics.estimatedEnergy : 75;

  return (
    <div className="dashboard-view animate-fade-in">
      <header className="view-header">
        <div className="header-top">
          <span className="date-pill">El Horizonte</span>
          <div className="header-actions">
            <button onClick={cycleViewMode} className="view-toggle">
              <Layout size={16} />
              <span>Cambiar Modo</span>
            </button>
            <button className="mode-toggle">
              <Settings2 size={16} />
              <span>{mode.toUpperCase()}</span>
            </button>
          </div>
        </div>
        <h1>Buen día, David</h1>
        <p className="greeting-sub">Tu energía cognitiva está lista para el enfoque profundo.</p>
      </header>

      {/* Energy Widget */}
      <section className="energy-widget">
        <div className="energy-info">
          <span className="energy-label">Nivel de Energía Estimado</span>
          <span className="energy-status">Óptimo para tareas complejas</span>
        </div>
        <div className="energy-bar-container">
          <div className="energy-bar-fill" style={{ width: `${energyLevel}%` }}></div>
        </div>
      </section>

      {activeSeason && (
        <section className="active-season-card">
          <div className="season-header-mini">
            <Wind size={18} className="icon-accent" />
            <span>Temporada de <strong>{activeSeason.theme}</strong></span>
          </div>
          <h3>{activeSeason.title}</h3>
          <div className="season-progress">
            <div className="progress-bar-thin"><div className="fill" style={{ width: '40%' }}></div></div>
          </div>
        </section>
      )}

      <div className="dashboard-grid-main">
        <section className="victories-section">
          <div className="section-header">
            <Sparkles size={20} className="icon-sparkle" />
            <h2>3 Victorias Críticas</h2>
          </div>
          <div className="victories-list">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="victory-card">
                <span className="victory-number">0{i + 1}</span>
                <div className="victory-content">
                  <div className="victory-tag">{rec.type}</div>
                  <h3>{rec.title}</h3>
                </div>
                <button className="btn-ghost" onClick={() => setShowZen(true)}><ArrowRight size={18} /></button>
              </div>
            ))}
            {recommendations.length === 0 && (
              <div className="empty-state">No hay victorias definidas para hoy.</div>
            )}
          </div>
        </section>

        <section className="quick-stats-grid">
          <div className="section-header">
            <Activity size={20} className="icon-accent" />
            <h2>Estado Actual</h2>
          </div>
          <div className="summary-section">
            {stats.map((stat, i) => (
              <div key={i} className={`summary-card ${stat.color}`}>
                <div className="card-icon">{stat.icon}</div>
                <div className="card-content">
                  <span className="card-label">{stat.label}</span>
                  <span className="card-value">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="metrics-section">
        <div className="section-header">
          <Maximize2 size={20} className="icon-accent" />
          <h2>Rendimiento Global</h2>
        </div>
        <div className="metrics-grid">
          {[
            { label: 'Disciplina', value: metrics?.disciplineIndex },
            { label: 'Metas', value: metrics?.goalProgressIndex },
            { label: 'Equilibrio', value: metrics?.lifeBalanceIndex },
            { label: 'Consistencia', value: metrics?.consistencyIndex },
            { label: 'Velocidad', value: metrics?.executionVelocity }
          ].map(m => (
            <div key={m.label} className="metric-item">
              <span className="metric-label">{m.label}</span>
              <div className="metric-visual">
                <div className="metric-bar"><div className="fill" style={{ width: `${m.value}%` }}></div></div>
                <span className="metric-value">{m.value}%</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gráfico de Ritmo Semanal */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <WeeklyRhythm data={rhythmData} />
        </div>
      </section>

      {showZen && <ZenFocus onClose={() => setShowZen(false)} />}
    </div>
  );
};

export default Dashboard;
