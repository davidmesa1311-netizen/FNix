import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tareas from './pages/Tareas';
import Metas from './pages/Metas';
import Habitos from './pages/Habitos';
import Temporadas from './pages/Temporadas';
import Calendario from './pages/Calendario';
import Finanzas from './pages/Finanzas';
import Actividad from './pages/Actividad';
import Analisis from './pages/Analisis';
import Configuracion from './pages/Configuracion';
import Santuario from './pages/Santuario';
import Onboarding from './components/Onboarding';
import { getSetting } from './db/db';

function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await getSetting('onboarding_completed');
        setShowOnboarding(value !== 'true');
      } catch (error: any) {
        console.error("Error en arranque:", error);
        setDbError("No se pudo conectar con el servidor. Asegúrate de ejecutar: npm run server");
      }
    };
    checkOnboarding();
  }, []);

  if (dbError) return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      color: '#f8fafc', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ 
        background: 'rgba(239, 68, 68, 0.1)', 
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Servidor No Disponible</h1>
        <p style={{ opacity: 0.7, marginBottom: '24px', lineHeight: '1.6' }}>{dbError}</p>
        <code style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.3)', 
          padding: '12px 20px', 
          borderRadius: '8px',
          marginBottom: '24px',
          color: '#22d3ee'
        }}>npm run server</code>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Reintentar Conexión
        </button>
      </div>
    </div>
  );

  if (showOnboarding === null) return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '48px', height: '48px', 
          border: '3px solid rgba(99, 102, 241, 0.3)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 style={{ marginBottom: '10px', fontWeight: '600' }}>Personal Focus System</h2>
        <p style={{ opacity: 0.5 }}>Conectando con el servidor...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tareas" element={<Tareas />} />
          <Route path="metas" element={<Metas />} />
          <Route path="habitos" element={<Habitos />} />
          <Route path="temporadas" element={<Temporadas />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="finanzas" element={<Finanzas />} />
          <Route path="actividad" element={<Actividad />} />
          <Route path="analisis" element={<Analisis />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="santuario" element={<Santuario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
