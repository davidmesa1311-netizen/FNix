import { supabase } from '../lib/supabase';

/**
 * AuthService — Gestión de autenticación de usuarios FNix.
 * Maneja registro, inicio de sesión, cierre de sesión y estado de sesión.
 */
export const AuthService = {
  /**
   * Registra un nuevo usuario con email y contraseña.
   */
  async signUp(email: string, password: string, displayName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Inicia sesión con email y contraseña.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Inicia sesión con un proveedor OAuth (Google, GitHub, etc.).
   */
  async signInWithProvider(provider: 'google' | 'github') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Cierra la sesión del usuario actual.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Obtiene la sesión actual del usuario.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Obtiene el usuario actual.
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Escucha cambios de estado de autenticación.
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
