import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  ListTodo, 
  Flame, 
  Target as TargetIcon, 
  Wind,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Calendar as CalendarIcon,
  Wallet,
  X,
  MoreHorizontal,
  Clock,
  Sparkles as WellnessIcon,
  BarChart3
} from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  // Main navigation items (always visible)
  const mainNavItems = [
    { to: '/', icon: <Home size={24} />, label: 'Inicio' },
    { to: '/tareas', icon: <ListTodo size={24} />, label: 'Tareas' },
    { to: '/metas', icon: <TargetIcon size={24} />, label: 'Metas' },
    { to: '/calendario', icon: <CalendarIcon size={24} />, label: 'Agenda' },
  ];

  // Secondary navigation items (in "More" menu)
  const secondaryNavItems = [
    { to: '/santuario', icon: <WellnessIcon size={20} />, label: 'Santuario' },
    { to: '/habitos', icon: <Flame size={20} />, label: 'Hábitos' },
    { to: '/temporadas', icon: <Wind size={20} />, label: 'Ciclos' },
    { to: '/finanzas', icon: <Wallet size={20} />, label: 'Finanzas' },
    { to: '/analisis', icon: <BarChart3 size={20} />, label: 'Análisis' },
    { to: '/configuracion', icon: <SettingsIcon size={20} />, label: 'Ajustes' },
  ];

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tareas') return 'Tareas';
    if (path === '/habitos') return 'Hábitos';
    if (path === '/metas') return 'Metas';
    if (path === '/temporadas') return 'Ciclos';
    if (path === '/calendario') return 'Calendario';
    if (path === '/finanzas') return 'Finanzas';
    if (path === '/analisis') return 'Análisis';
    if (path === '/configuracion') return 'Ajustes';
    if (path === '/santuario') return 'Santuario';
    return '';
  };

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <img src="/logosinfondo.png" alt="FNix" className="brand-logo-img" />
        </div>
        
        <nav className="sidebar-links">
          {[...mainNavItems, ...secondaryNavItems].map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        <header className="app-header-mobile">
          <div className="header-brand-mobile">
            <img src="/logosinfondo.png" alt="FNix" className="brand-logo-mini" />
            <h1 className="header-title">{getTitle()}</h1>
          </div>
          <button onClick={toggleTheme} className="theme-toggle-mobile" aria-label="Cambiar tema">
            {isDark ? <Sun size={20} className="icon-sun" /> : <Moon size={20} className="icon-moon" />}
          </button>
        </header>

        <div className="app-content-area">
          <Outlet />
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="app-nav-mobile">
          {mainNavItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => `nav-item-mobile ${isActive ? 'is-active' : ''}`}
            >
              <div className="nav-icon-mobile">{item.icon}</div>
              <span className="nav-label-mobile">{item.label}</span>
            </NavLink>
          ))}
          <button 
            className={`nav-item-mobile ${isMoreMenuOpen ? 'is-active' : ''}`}
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          >
            <div className="nav-icon-mobile"><MoreHorizontal size={24} /></div>
            <span className="nav-label-mobile">Más</span>
          </button>
        </nav>

        {/* More Menu Overlay (Mobile) */}
        {isMoreMenuOpen && (
          <div className="more-menu-overlay" onClick={() => setIsMoreMenuOpen(false)}>
            <div className="more-menu-content" onClick={e => e.stopPropagation()}>
              <div className="more-menu-header">
                <h3>Explorar Módulos</h3>
                <button onClick={() => setIsMoreMenuOpen(false)}><X size={20} /></button>
              </div>
              <div className="more-menu-grid">
                {secondaryNavItems.map(item => (
                  <NavLink 
                    key={item.to} 
                    to={item.to} 
                    className="more-menu-item"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    <div className="more-item-icon">{item.icon}</div>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
