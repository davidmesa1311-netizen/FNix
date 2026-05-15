import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
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
    </BrowserRouter>
  );
}

export default App;
