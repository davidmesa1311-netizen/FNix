import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Scale, 
  Cpu, 
  CheckCircle2,
  Shield,
  Cloud,
  Zap
} from 'lucide-react';
import { SettingsService } from '../services/SettingsService';
import './Configuracion.css';

const Configuracion: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await SettingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    try {
      await SettingsService.setSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      setSaveStatus('Ajustes sincronizados');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="config-view animate-fade">
      <header className="view-header">
        <div>
          <h1>Configuración</h1>
          <p className="subtitle">Calibra el motor de FNix para optimizar tu rendimiento.</p>
        </div>
        {saveStatus && (
          <div className="save-toast">
            <CheckCircle2 size={16} />
            <span>{saveStatus}</span>
          </div>
        )}
      </header>

      <div className="config-sections">
        {/* Cloud Status */}
        <section className="config-card premium-card">
           <div className="card-header">
              <Shield size={20} className="icon-brand" />
              <h2>Infraestructura</h2>
           </div>
           <div className="cloud-status">
              <div className="cloud-icon">
                 <Cloud size={24} />
              </div>
              <div className="cloud-info">
                 <strong>Sincronización Activa</strong>
                 <p>Tus datos están protegidos en Supabase Cloud.</p>
              </div>
              <span className="status-dot-active">Online</span>
           </div>
        </section>

        {/* Performance Thresholds */}
        <section className="config-card premium-card">
           <div className="card-header">
              <Sliders size={20} className="icon-brand" />
              <h2>Umbrales de Enfoque</h2>
           </div>
           <div className="settings-list">
              <div className="setting-item">
                 <div className="setting-info">
                    <label>Disciplina Mínima</label>
                    <p>Objetivo diario para estado de flujo.</p>
                 </div>
                 <div className="setting-control">
                    <input 
                      type="range" min="0" max="100" 
                      value={settings.threshold_discipline || '70'} 
                      onChange={e => handleUpdate('threshold_discipline', e.target.value)} 
                    />
                    <span className="value-tag">{settings.threshold_discipline || '70'}%</span>
                 </div>
              </div>
              <div className="setting-item">
                 <div className="setting-info">
                    <label>Avance Semanal</label>
                    <p>Compromiso de progreso en metas.</p>
                 </div>
                 <div className="setting-control">
                    <input 
                      type="range" min="0" max="100" 
                      value={settings.threshold_goals || '50'} 
                      onChange={e => handleUpdate('threshold_goals', e.target.value)} 
                    />
                    <span className="value-tag">{settings.threshold_goals || '50'}%</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Mode */}
        <section className="config-card premium-card">
           <div className="card-header">
              <Cpu size={20} className="icon-brand" />
              <h2>Modo de Operación</h2>
           </div>
           <div className="mode-selector">
              {[
                { id: 'assisted', label: 'Asistido', desc: 'Recomendaciones proactivas del motor ESP.', icon: <Zap size={16} /> },
                { id: 'manual', label: 'Manual', desc: 'Tú controlas cada aspecto sin sugerencias.', icon: <Sliders size={16} /> }
              ].map(m => (
                <button 
                  key={m.id}
                  className={`mode-option ${settings.operation_mode === m.id ? 'active' : ''}`}
                  onClick={() => handleUpdate('operation_mode', m.id)}
                >
                   <div className="mode-icon">{m.icon}</div>
                   <div className="mode-text">
                      <strong>{m.label}</strong>
                      <p>{m.desc}</p>
                   </div>
                </button>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default Configuracion;
