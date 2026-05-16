-- ═══════════════════════════════════════════════════════════════
-- FNix — Migración a Sistema Multi-Usuario
-- 
-- INSTRUCCIONES:
-- 1. Abre el SQL Editor en Supabase: 
--    https://supabase.com/dashboard/project/ezlczvsahpztypkstelc/sql/new
-- 2. Copia y pega TODO este bloque
-- 3. Haz clic en "Run"
-- ═══════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────
-- PASO 1: Cambiar user_id de INTEGER a UUID en tablas que ya lo tienen
-- ───────────────────────────────────────────────────────────────

-- goals: eliminar columna vieja y crear la nueva
ALTER TABLE goals DROP COLUMN IF EXISTS user_id;
ALTER TABLE goals ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- tasks: eliminar columna vieja y crear la nueva
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;
ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- habits: eliminar columna vieja y crear la nueva
ALTER TABLE habits DROP COLUMN IF EXISTS user_id;
ALTER TABLE habits ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- habit_logs: eliminar columna vieja y crear la nueva
ALTER TABLE habit_logs DROP COLUMN IF EXISTS user_id;
ALTER TABLE habit_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- activity_logs: eliminar columna vieja y crear la nueva
ALTER TABLE activity_logs DROP COLUMN IF EXISTS user_id;
ALTER TABLE activity_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ───────────────────────────────────────────────────────────────
-- PASO 2: Agregar user_id a tablas que no lo tienen
-- ───────────────────────────────────────────────────────────────

-- seasons
ALTER TABLE seasons ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- scheduled_events
ALTER TABLE scheduled_events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- monthly_payments
ALTER TABLE monthly_payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- focus_settings: necesita restructuración para soporte multi-usuario
-- Primero, agregar user_id
ALTER TABLE focus_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Cambiar la clave primaria de focus_settings para soportar multi-usuario
-- (la PK actual es solo 'key', necesitamos que sea 'user_id + key')
ALTER TABLE focus_settings DROP CONSTRAINT IF EXISTS focus_settings_pkey;
ALTER TABLE focus_settings ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE focus_settings ADD CONSTRAINT focus_settings_pkey PRIMARY KEY (id);
ALTER TABLE focus_settings ADD CONSTRAINT focus_settings_user_key_unique UNIQUE (user_id, key);

-- ───────────────────────────────────────────────────────────────
-- PASO 3: Eliminar políticas RLS viejas ("Allow all")
-- ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow all" ON goals;
DROP POLICY IF EXISTS "Allow all" ON tasks;
DROP POLICY IF EXISTS "Allow all" ON habits;
DROP POLICY IF EXISTS "Allow all" ON habit_logs;
DROP POLICY IF EXISTS "Allow all" ON focus_settings;
DROP POLICY IF EXISTS "Allow all" ON seasons;
DROP POLICY IF EXISTS "Allow all" ON season_goals;
DROP POLICY IF EXISTS "Allow all" ON scheduled_events;
DROP POLICY IF EXISTS "Allow all" ON monthly_payments;
DROP POLICY IF EXISTS "Allow all" ON activity_logs;

-- ───────────────────────────────────────────────────────────────
-- PASO 4: Crear nuevas políticas RLS por usuario
-- ───────────────────────────────────────────────────────────────

-- Primero eliminar cualquier política existente con estos nombres
DROP POLICY IF EXISTS "Users own goals" ON goals;
DROP POLICY IF EXISTS "Users own tasks" ON tasks;
DROP POLICY IF EXISTS "Users own habits" ON habits;
DROP POLICY IF EXISTS "Users own habit_logs" ON habit_logs;
DROP POLICY IF EXISTS "Users own settings" ON focus_settings;
DROP POLICY IF EXISTS "Users own seasons" ON seasons;
DROP POLICY IF EXISTS "Users own events" ON scheduled_events;
DROP POLICY IF EXISTS "Users own payments" ON monthly_payments;
DROP POLICY IF EXISTS "Users own activity" ON activity_logs;

-- Crear políticas nuevas
CREATE POLICY "Users own goals" ON goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own tasks" ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own habits" ON habits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own habit_logs" ON habit_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own settings" ON focus_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own seasons" ON seasons FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own events" ON scheduled_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own payments" ON monthly_payments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own activity" ON activity_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────
-- ✅ LISTO — La base de datos ahora soporta múltiples usuarios
-- Cada usuario solo podrá ver y modificar sus propios datos.
-- ───────────────────────────────────────────────────────────────
