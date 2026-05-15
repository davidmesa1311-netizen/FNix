import React, { useState, useEffect } from 'react';
import { 
  History, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { ActivityService } from '../services/ActivityService';
import './Actividad.css';

const Actividad: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const data = await ActivityService.getRecentActivity(50);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action: string) => {
    switch (action) {
      case 'create': return <PlusCircle size={20} style={{ color: 'hsl(var(--brand))' }} />;
      case 'complete': return <CheckCircle2 size={20} style={{ color: 'hsl(var(--success))' }} />;
      case 'delete': return <Trash2 size={20} style={{ color: 'hsl(var(--danger))' }} />;
      case 'reopen': return <RefreshCw size={20} style={{ color: 'hsl(var(--warning))' }} />;
      default: return <History size={20} />;
    }
  };

  return (
    <div className="actividad-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Registro de Actividad</h1>
          <p className="subtitle">Línea de tiempo de tus decisiones y progresos.</p>
        </div>
        <button className="btn-ghost" onClick={loadActivity}>
          <RefreshCw size={18} />
          <span>Refrescar</span>
        </button>
      </header>

      <div className="activity-timeline">
        {loading ? (
          <div className="loading-state">Auditando registros...</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <History size={48} />
            <p>Aún no hay actividad registrada.</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={log.id} className="activity-item animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="timeline-connector">
                <div className="timeline-icon">
                  {getIcon(log.action)}
                </div>
                {i !== logs.length - 1 && <div className="timeline-line"></div>}
              </div>
              
              <div className="premium-card activity-content-card">
                <div className="activity-header">
                  <span className="activity-details">{log.details}</span>
                  <span className="activity-meta">
                    <Clock size={12} />
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="activity-footer">
                  <span className="entity-badge">{log.entity_type}</span>
                  <span className="date-stamp">{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Actividad;
