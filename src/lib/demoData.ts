import { executeQuery } from '../db/db';

/**
 * Generador de Datos de Demostración para FNix
 * Permite poblar el sistema con ejemplos para mostrar su potencial.
 */
export const injectDemoData = async () => {
  try {
    // 1. Limpiar datos previos (opcional, pero recomendado para una demo limpia)
    const tables = ['goals', 'tasks', 'habits', 'habit_logs', 'seasons'];
    for (const table of tables) {
      await executeQuery(`DELETE FROM ${table}`);
    }

    // 2. Inyectar Metas
    await executeQuery(`
      INSERT INTO goals (title, description, category, target_date) VALUES 
      ('Lanzar Producto MVP', 'Completar todas las funcionalidades core', 'Trabajo', date('now', '+30 days')),
      ('Correr 10K', 'Mejorar condición física y resistencia', 'Salud', date('now', '+60 days')),
      ('Ahorro para Viaje', 'Fondo de emergencia y vacaciones', 'Finanzas', date('now', '+90 days'))
    `);

    // 3. Inyectar Tareas
    await executeQuery(`
      INSERT INTO tasks (goal_id, title, status, priority, category) VALUES 
      (1, 'Finalizar sistema de onboarding', 'pending', 3, 'Trabajo'),
      (1, 'Optimizar consultas SQL', 'completed', 2, 'Trabajo'),
      (2, 'Comprar zapatillas nuevas', 'completed', 1, 'Salud'),
      (null, 'Llamar al banco', 'pending', 2, 'Finanzas'),
      (null, 'Meditar 10 min', 'pending', 1, 'Personal')
    `);

    // 4. Inyectar Hábitos
    await executeQuery(`
      INSERT INTO habits (title, category) VALUES 
      ('Beber 2L de agua', 'Salud'),
      ('Lectura técnica', 'Trabajo'),
      ('Revisión de gastos', 'Finanzas')
    `);

    // 5. Inyectar Temporada
    await executeQuery(`
      INSERT INTO seasons (title, theme, start_date, end_date, status) VALUES 
      ('Ciclo de Ejecución', 'Trabajo', date('now'), date('now', '+30 days'), 'active')
    `);

    return true;
  } catch (error) {
    console.error('Error al inyectar datos de demo:', error);
    throw error;
  }
};
