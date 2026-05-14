-- ═══════════════════════════════════════════════════════════════
-- PFS (Personal Focus System) - Schema para Supabase
-- ═══════════════════════════════════════════════════════════════

-- 1. Metas
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  user_id INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  target_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- 2. Tareas
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  user_id INTEGER DEFAULT 1,
  goal_id BIGINT REFERENCES goals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 1,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- 3. Hábitos
CREATE TABLE IF NOT EXISTS habits (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER DEFAULT 1,
  goal_id BIGINT REFERENCES goals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  frequency TEXT DEFAULT 'daily',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Registro de Hábitos
CREATE TABLE IF NOT EXISTS habit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER DEFAULT 1,
  habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_at DATE DEFAULT CURRENT_DATE
);

-- 5. Configuración del Sistema
CREATE TABLE IF NOT EXISTS focus_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 6. Temporadas
CREATE TABLE IF NOT EXISTS seasons (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  theme TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active'
);

-- 7. Vínculo Metas-Temporadas
CREATE TABLE IF NOT EXISTS season_goals (
  season_id BIGINT REFERENCES seasons(id) ON DELETE CASCADE,
  goal_id BIGINT REFERENCES goals(id) ON DELETE CASCADE,
  PRIMARY KEY (season_id, goal_id)
);

-- 8. Eventos Programados
CREATE TABLE IF NOT EXISTS scheduled_events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  category TEXT,
  alert_enabled BOOLEAN DEFAULT true
);

-- 9. Pagos Mensuales
CREATE TABLE IF NOT EXISTS monthly_payments (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_day INTEGER NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- 10. Registros de Actividad
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER DEFAULT 1,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- Configuración por defecto
-- ═══════════════════════════════════════════════════════════════
INSERT INTO focus_settings (key, value) VALUES
  ('onboarding_completed', 'false'),
  ('mode', 'assisted'),
  ('view_mode', 'complete'),
  ('threshold_discipline', '70'),
  ('threshold_goals', '50'),
  ('threshold_balance', '60'),
  ('threshold_consistency', '80'),
  ('weight_tasks', '40'),
  ('weight_habits', '40'),
  ('weight_goals', '20'),
  ('auto_suggestions', 'true'),
  ('auto_improvement_plans', 'true')
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- Habilitar acceso público (Row Level Security desactivada por ahora)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para desarrollo)
CREATE POLICY "Allow all" ON goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON habit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON focus_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON seasons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON season_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON scheduled_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON monthly_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
