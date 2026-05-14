import { executeQuery } from '../db/db';

/**
 * Gestor de Respaldos de FNix (100% Offline)
 */

const TABLES = [
  'goals', 'tasks', 'habits', 'habit_logs', 
  'focus_settings', 'seasons', 'season_goals',
  'scheduled_events', 'monthly_payments'
];

export const exportBackup = async () => {
  try {
    const backupData: any = {};

    for (const table of TABLES) {
      const data = await executeQuery(`SELECT * FROM ${table}`);
      backupData[table] = data;
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pfsdmg_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exportando respaldo:', error);
    throw error;
  }
};

export const importBackup = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // 1. Validar que es un respaldo de FNix (verificando tablas clave)
        if (!backupData.focus_settings || !backupData.tasks) {
          throw new Error('Archivo de respaldo no válido.');
        }

        // 2. Limpiar tablas actuales y restaurar
        // Usamos una transacción manual simulada
        for (const table of TABLES) {
          await executeQuery(`DELETE FROM ${table}`);
          const rows = backupData[table] || [];
          for (const row of rows) {
            const placeholders = row.map(() => '?').join(',');
            await executeQuery(`INSERT INTO ${table} VALUES (${placeholders})`, row);
          }
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
