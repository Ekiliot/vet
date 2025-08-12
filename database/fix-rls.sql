-- Временное исправление RLS для демонстрации
-- Выполните этот скрипт в SQL Editor вашего проекта Supabase

-- Вариант 1: Отключить RLS полностью (временно, для демонстрации)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Вариант 2: Если хотите оставить RLS, создайте более простые политики
-- Сначала удалите существующие политики
-- DROP POLICY IF EXISTS "Allow insert for all" ON clients;
-- DROP POLICY IF EXISTS "Allow read for authenticated users" ON clients;
-- DROP POLICY IF EXISTS "Allow update for authenticated users" ON clients;
-- DROP POLICY IF EXISTS "Allow delete for authenticated users" ON clients;

-- Затем создайте новые, более простые политики
-- CREATE POLICY "Enable insert for all" ON clients FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable select for all" ON clients FOR SELECT USING (true);
-- CREATE POLICY "Enable update for all" ON clients FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete for all" ON clients FOR DELETE USING (true);

-- Проверьте, что таблица доступна
SELECT 'RLS disabled successfully' as status;
SELECT COUNT(*) as total_clients FROM clients; 