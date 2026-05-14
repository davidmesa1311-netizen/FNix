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
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'task', label: 'Tareas', entity: 'task' },
    { id: 'goal', label: 'Metas', entity: 'goal' },
    { id: 'complete', label: 'Completados', action: 'complete' },
    { id: 'delete', label: 'Eliminados', action: 'delete' },
  ];

  const loadActivity = async (filterId: string) => {
    setLoading(true);
    const filter = filters.find(f => f.id === filterId);
    try {
      const data = await ActivityService.getRecentActivity(50, filter?.action, filter?.entity);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity(activeFilter);
  }, [activeFilter]);

  const getIcon = (action: string) => {
    switch (action) {
      case 'create': return <PlusCircle size={18} className="icon-brand" />;
      case 'complete': return <CheckCircle2 size={18} className="icon-success" />;
      case 'delete': return <Trash2 size={18} className="icon-danger" />;
      case 'reopen': return <RefreshCw size={18} className="icon-warning" />;
      default: return <History size={18} />;
    }
  };

  return (
    <div className="actividad-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Registro de Actividad</h1>
          <p>Historial de cambios y auditoría del sistema.</p>
        </div>
      </header>

      <div className="filter-scroll">
        <div className="category-chips">
          {filters.map(f => (
            <button 
              key={f.id} 
              className={`category-chip ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="activity-timeline">
        {loading ? (
          <div className="loading-state">Consultando el registro de auditoría...</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <History size={64} strokeWidth={1} />
            <h2>Sin actividad</h2>
            <p>No hay registros que coincidan con el filtro seleccionado.</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={log.id} className="activity-item-premium">
              <div className="activity-icon-container">
                {getIcon(log.action)}
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
                <div className="activity-date">
                  {new Date(log.created_at).toLocaleDateString()}
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
