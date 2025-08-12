-- Создание таблицы клиентов для ветеринарной клиники Федорова
-- Выполните этот скрипт в SQL Editor вашего проекта Supabase

-- Создание таблицы clients
CREATE TABLE IF NOT EXISTS clients (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    pet_name VARCHAR(100),
    pet_type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_pet_type ON clients(pet_type);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(first_name, last_name);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создание триггера для автоматического обновления updated_at
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Создание представления для статистики
CREATE OR REPLACE VIEW clients_stats AS
SELECT 
    COUNT(*) as total_clients,
    COUNT(CASE WHEN created_at::date = CURRENT_DATE THEN 1 END) as today_clients,
    COUNT(CASE WHEN created_at::date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_clients,
    COUNT(CASE WHEN created_at::date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_clients,
    COUNT(CASE WHEN pet_type = 'собака' THEN 1 END) as dog_clients,
    COUNT(CASE WHEN pet_type = 'кошка' THEN 1 END) as cat_clients,
    COUNT(CASE WHEN pet_type = 'птица' THEN 1 END) as bird_clients,
    COUNT(CASE WHEN pet_type = 'грызун' THEN 1 END) as rodent_clients,
    COUNT(CASE WHEN pet_type NOT IN ('собака', 'кошка', 'птица', 'грызун') AND pet_type IS NOT NULL THEN 1 END) as other_clients
FROM clients;

-- Создание представления для активности по дням
CREATE OR REPLACE VIEW daily_activity AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as client_count
FROM clients 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Включение Row Level Security (RLS) для безопасности
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Создание политик безопасности
-- Разрешить вставку всем (для формы на сайте)
CREATE POLICY "Allow insert for all" ON clients
    FOR INSERT WITH CHECK (true);

-- Разрешить чтение всем (для демонстрации, в продакшне ограничить)
CREATE POLICY "Allow read for all" ON clients
    FOR SELECT USING (true);

-- Разрешить обновление только аутентифицированным пользователям
CREATE POLICY "Allow update for authenticated users" ON clients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Разрешить удаление только аутентифицированным пользователям
CREATE POLICY "Allow delete for authenticated users" ON clients
    FOR DELETE USING (auth.role() = 'authenticated');

-- Комментарии к таблице и колонкам
COMMENT ON TABLE clients IS 'Таблица клиентов ветеринарной клиники Федорова';
COMMENT ON COLUMN clients.first_name IS 'Имя клиента';
COMMENT ON COLUMN clients.last_name IS 'Фамилия клиента';
COMMENT ON COLUMN clients.phone IS 'Номер телефона клиента';
COMMENT ON COLUMN clients.email IS 'Email адрес клиента';
COMMENT ON COLUMN clients.pet_name IS 'Имя питомца';
COMMENT ON COLUMN clients.pet_type IS 'Тип питомца (собака, кошка, птица, грызун, другое)';
COMMENT ON COLUMN clients.message IS 'Дополнительное сообщение от клиента';
COMMENT ON COLUMN clients.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN clients.updated_at IS 'Дата и время последнего обновления записи';

-- Вставка тестовых данных (опционально, для демонстрации)
INSERT INTO clients (first_name, last_name, phone, email, pet_name, pet_type, message) VALUES
('Иван', 'Петров', '+37377512345', 'ivan@example.com', 'Бобик', 'собака', 'Нужна консультация по питанию'),
('Мария', 'Сидорова', '+37377567890', 'maria@example.com', 'Мурка', 'кошка', 'Плановый осмотр'),
('Алексей', 'Козлов', '+37377511111', 'alex@example.com', 'Кеша', 'птица', 'Проверка здоровья'),
('Елена', 'Волкова', '+37377522222', 'elena@example.com', 'Хомка', 'грызун', 'Вакцинация');

-- Вывод информации о созданных объектах
SELECT 'Table clients created successfully' as status;
SELECT 'Indexes created successfully' as status;
SELECT 'Triggers created successfully' as status;
SELECT 'Views created successfully' as status;
SELECT 'Security policies created successfully' as status;
SELECT 'Sample data inserted successfully' as status; 