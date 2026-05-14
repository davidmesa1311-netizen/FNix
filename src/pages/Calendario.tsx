import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Share2,
  Cloud,
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';
import { supabase } from '../db/db';
import './Calendario.css';

interface Event {
  id: number;
  title: string;
  event_date: string;
  category: string;
  alert_enabled: boolean;
}

const Calendario: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [showSync, setShowSync] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const loadEvents = async () => {
    const { data } = await supabase
      .from('scheduled_events')
      .select('*')
      .order('event_date', { ascending: true });
    
    setEvents((data || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      event_date: e.event_date,
      category: e.category,
      alert_enabled: e.alert_enabled
    })));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    await supabase
      .from('scheduled_events')
      .insert({ title: newTitle, event_date: newDate });

    setNewTitle('');
    setNewDate('');
    setIsAdding(false);
    loadEvents();
  };

  return (
    <div className="calendario-view">
      <header className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="header-info">
          <h1>Calendario y Agenda</h1>
          <p>Tus actividades programadas y alertas.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button onClick={() => setShowSync(!showSync)} className={`btn-ghost ${showSync ? 'active' : ''}`}>
            <Cloud size={20} />
            <span className="hide-mobile">Sincronizar</span>
          </button>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="btn-fab">
              <Plus size={20} />
              <span className="hide-mobile">Nuevo Evento</span>
            </button>
          )}
        </div>
      </header>

      {showSync && (
        <section className="sync-hub-card animate-slide-up">
          <div className="sync-header">
            <div className="sync-info">
              <h3>Sincronización Externa</h3>
              <p>Conecta tus calendarios de Google, Outlook o Apple con FNix.</p>
            </div>
            <div className="sync-status">
              <span className={`status-dot ${isSynced ? 'active' : ''}`}></span>
              {isSynced ? 'Conectado' : 'Sin vincular'}
            </div>
          </div>
          
          <div className="sync-grid">
            <div className="sync-option">
              <div className="option-brand google">G</div>
              <div className="option-text">
                <strong>Google Calendar</strong>
                <span>Eventos bidireccionales</span>
              </div>
              <button onClick={() => setIsSynced(!isSynced)} className={isSynced ? 'btn-ghost' : 'btn-primary'}>
                {isSynced ? 'Desconectar' : 'Vincular'}
              </button>
            </div>
            
            <div className="sync-option">
              <div className="option-brand outlook">O</div>
              <div className="option-text">
                <strong>Microsoft Outlook</strong>
                <span>Solo lectura</span>
              </div>
              <button className="btn-ghost" disabled>Próximamente</button>
            </div>
          </div>

          <div className="sync-footer">
            <div className="ics-export">
              <Share2 size={16} />
              <span>Enlace ICS para suscripción externa</span>
            </div>
            <button className="btn-icon-mini"><Download size={16} /></button>
          </div>
        </section>
      )}

      {isAdding && (
        <div className="creator-card animate-slide-up">
          <form onSubmit={handleAddEvent}>
            <input 
              type="text" 
              placeholder="¿Qué evento quieres programar?" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              className="creator-title-input"
              autoFocus
            />
            
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '200px' }}>
                <div className="input-label">
                  <Clock size={14} /> Fecha y Hora
                </div>
                <input 
                  type="datetime-local" 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid hsl(var(--border))', 
                    background: 'hsl(var(--bg-secondary))', 
                    color: 'hsl(var(--text-primary))',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
              <button type="button" className="btn-ghost" onClick={() => setIsAdding(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={!newTitle.trim() || !newDate}>
                <Plus size={18} /> Programar
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="calendar-strip">
        <div className="strip-header">
          <h2>Mayo 2026</h2>
          <div className="strip-nav">
            <ChevronLeft size={20} />
            <ChevronRight size={20} />
          </div>
        </div>
        <div className="days-row">
          {[11, 12, 13, 14, 15, 16, 17].map(day => (
            <div key={day} className={`day-cell ${day === 11 ? 'today' : ''}`}>
              <span className="day-name">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][day % 7]}</span>
              <span className="day-num">{day}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="agenda-section">
        <div className="section-header">
          <h2>Próximos Eventos</h2>
        </div>

        <div className="events-list">
          {events.length === 0 ? (
            <div className="empty-state">No hay eventos programados.</div>
          ) : (
            events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-time">
                  <Clock size={14} />
                  <span>{new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <span className="event-date-sub">{new Date(event.event_date).toLocaleDateString()}</span>
                </div>
                {event.alert_enabled && <Bell size={18} className="icon-alert" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendario;
