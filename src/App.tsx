import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tareas from './pages/Tareas';
import Habitos from './pages/Habitos';
import Metas from './pages/Metas';
import Temporadas from './pages/Temporadas';
import Finanzas from './pages/Finanzas';
import Actividad from './pages/Actividad';
import Santuario from './pages/Santuario';
import Configuracion from './pages/Configuracion';
import AuthPage from './pages/AuthPage';

/**
 * Componente que protege las rutas internas.
 * Si el usuario no ha iniciado sesión, lo redirige al Login.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'hsl(222 47% 4%)',
        color: 'hsl(210 40% 98%)',
        fontFamily: 'var(--font-main)',
        fontSize: '1.1rem',
      }}>
        Cargando FNix...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

/**
 * Ruta pública: si ya estás logueado, te envía al Dashboard.
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública: Login/Registro */}
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas: Dashboard y módulos */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tareas" element={<Tareas />} />
            <Route path="habitos" element={<Habitos />} />
            <Route path="metas" element={<Metas />} />
            <Route path="temporadas" element={<Temporadas />} />
            <Route path="finanzas" element={<Finanzas />} />
            <Route path="actividad" element={<Actividad />} />
            <Route path="santuario" element={<Santuario />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
