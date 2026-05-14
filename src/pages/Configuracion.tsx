import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Scale, 
  Cpu, 
  CheckCircle2,
  Shield
} from 'lucide-react';
import { getSettings, setSetting } from '../db/db';
import './Configuracion.css';

const Configuracion: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadSettings = async () => {
    const data = await getSettings();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    await setSetting(key, value);
    setSettings({ ...settings, [key]: value });
    setSaveStatus('Guardado');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  if (loading) return <div className="loading-state">Cargando ajustes...</div>;

  return (
    <div className="config-view animate-fade-in">
      <header className="view-header">
        <div className="header-info">
          <h1>Configuración</h1>
          <p>Ajusta el cerebro del sistema a tu medida.</p>
        </div>
        {saveStatus && (
          <div className="save-indicator animate-slide-up">
            <CheckCircle2 size={16} /> {saveStatus}
          </div>
        )}
      </header>

      {/* Sección: Estado del Sistema */}
      <section className="config-section-premium">
        <div className="section-title-row">
          <div className="section-icon-bg"><Shield size={20} /></div>
          <h2>Sistema y Datos</h2>
        </div>
        <div className="cloud-status-card">
          <p>Tus datos están sincronizados automáticamente con Supabase.</p>
          <div className="status-badge-cloud">☁️ Conectado a la Nube</div>
        </div>
      </section>

      {/* Sección 1: Umbrales de Rendimiento */}
      <section className="config-section-premium">
        <div className="section-title-row">
          <div className="section-icon-bg"><Sliders size={20} /></div>
          <h2>Umbrales de Rendimiento</h2>
        </div>
        <div className="config-list">
          <div className="config-item-premium">
            <div className="config-info">
              <label>Umbral de Disciplina</label>
              <span>Mínimo para considerar el día como "Exitoso"</span>
            </div>
            <div className="slider-group">
              <input 
                type="range" min="0" max="100" 
                value={settings.threshold_discipline || 70} 
                onChange={(e) => handleUpdate('threshold_discipline', e.target.value)}
              />
              <span className="value-badge">{settings.threshold_discipline || 70}%</span>
            </div>
          </div>
          <div className="config-item-premium">
            <div className="config-info">
              <label>Umbral de Metas</label>
              <span>Porcentaje mínimo de avance semanal</span>
            </div>
            <div className="slider-group">
              <input 
                type="range" min="0" max="100" 
                value={settings.threshold_goals || 50} 
                onChange={(e) => handleUpdate('threshold_goals', e.target.value)}
              />
              <span className="value-badge">{settings.threshold_goals || 50}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Pesos de Componentes */}
      <section className="config-section-premium">
        <div className="section-title-row">
          <div className="section-icon-bg"><Scale size={20} /></div>
          <h2>Pesos del Sistema</h2>
        </div>
        <div className="config-list">
          <div className="config-item-premium">
            <div className="config-info">
              <label>Importancia de Tareas</label>
            </div>
            <div className="slider-group">
              <input 
                type="range" min="0" max="100" 
                value={settings.weight_tasks || 40} 
                onChange={(e) => handleUpdate('weight_tasks', e.target.value)}
              />
              <span className="value-badge">{settings.weight_tasks || 40}%</span>
            </div>
          </div>
          <div className="config-item-premium">
            <div className="config-info">
              <label>Importancia de Hábitos</label>
            </div>
            <div className="slider-group">
              <input 
                type="range" min="0" max="100" 
                value={settings.weight_habits || 40} 
                onChange={(e) => handleUpdate('weight_habits', e.target.value)}
              />
              <span className="value-badge">{settings.weight_habits || 40}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Automatización */}
      <section className="config-section-premium">
        <div className="section-title-row">
          <div className="section-icon-bg"><Cpu size={20} /></div>
          <h2>Nivel de Automatización</h2>
        </div>
        <div className="category-chips">
          {['assisted', 'semi-auto', 'manual'].map(m => (
            <button 
              key={m}
              className={`category-chip ${settings.mode === m ? 'active' : ''}`}
              onClick={() => handleUpdate('mode', m)}
            >
              {m === 'assisted' ? '🤖 Asistido' : m === 'semi-auto' ? '⚡ Semi-Auto' : '✋ Manual'}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Configuracion;
