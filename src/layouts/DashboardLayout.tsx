import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Zap, 
  Target, 
  Wind, 
  Wallet, 
  History, 
  Settings,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import './DashboardLayout.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tareas', icon: CheckCircle2, label: 'Tareas' },
  { path: '/habitos', icon: Zap, label: 'Hábitos' },
  { path: '/metas', icon: Target, label: 'Metas' },
  { path: '/temporadas', icon: Wind, label: 'Ciclos' },
  { path: '/finanzas', icon: Wallet, label: 'Finanzas' },
  { path: '/actividad', icon: History, label: 'Actividad' },
  { path: '/santuario', icon: Sparkles, label: 'Santuario' },
  { path: '/configuracion', icon: Settings, label: 'Ajustes' },
];

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const getPageTitle = () => {
    const item = navItems.find(item => item.path === location.pathname);
    return item ? item.label : 'FNix';
  };

  return (
    <div className="layout-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="header-brand-group">
          <button onClick={() => setSidebarOpen(true)} className="icon-button">
            <Menu size={24} />
          </button>
          <div className="brand-logo-mini">
            <img src="/logosinfondo.png" alt="FNix" className="logo-img-mini" />
          </div>
        </div>
        <span className="page-title">{getPageTitle()}</span>
        <button onClick={toggleTheme} className="theme-toggle-mobile icon-button" aria-label="Cambiar tema">
          {isDark ? <Sun size={20} className="icon-sun" /> : <Moon size={20} className="icon-moon" />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/logosinfondo.png" alt="FNix" className="brand-logo-img" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="mobile-close icon-button">
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
          <div className="user-profile">
            <div className="avatar">D</div>
            <div className="user-info">
              <span className="user-name">David</span>
              <span className="user-status">Enfoque: Alto</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
