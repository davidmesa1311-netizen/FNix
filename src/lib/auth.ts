import { supabase } from './supabase';

/**
 * Obtiene el ID del usuario autenticado actual.
 * Lanza un error si no hay sesión activa.
 */
export const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No hay sesión activa. Inicia sesión primero.');
  return user.id;
};
