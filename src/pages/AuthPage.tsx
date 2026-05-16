import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        await AuthService.signIn(email, password);
      } else {
        await AuthService.signUp(email, password, displayName);
        setSuccessMessage('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setDisplayName('');
      }
    } catch (err: any) {
      const msg = err?.message || 'Ocurrió un error inesperado.';
      if (msg.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos.');
      } else if (msg.includes('already registered')) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else if (msg.includes('Password should be')) {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-page" data-theme="dark">
      {/* Fondo animado */}
      <div className="auth-bg-effects">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="bg-grid-overlay"></div>
      </div>

      <div className="auth-container animate-fade">
        {/* Logo y branding */}
        <div className="auth-brand">
          <img src="/logosinfondo.png" alt="FNix" className="auth-logo" />
          <p className="auth-tagline">
            <Zap size={16} className="tagline-icon" />
            Sistema de Enfoque Personal
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="auth-card glass">
          <h2 className="auth-title">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Tu santuario de productividad te espera.'
              : 'Únete al renacimiento de tu enfoque personal.'}
          </p>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="auth-message auth-success">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nombre (solo en registro) */}
            {!isLogin && (
              <div className="input-group animate-fade">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Tu nombre"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="auth-input"
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div className="input-group">
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                id="auth-email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div className="input-group">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Botón principal */}
            <button
              id="auth-submit"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">Procesando...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Alternar entre Login y Registro */}
          <div className="auth-toggle">
            <span className="auth-toggle-text">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </span>
            <button
              type="button"
              className="auth-toggle-btn"
              onClick={toggleMode}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="auth-footer">
          FNix — Tu enfoque, tu poder ⚡
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
