const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Простая проверка авторизации через сессию
const checkAuth = (req, res, next) => {
    console.log('🔐 Проверка авторизации:', {
        hasSession: !!req.session,
        isAuthenticated: req.session?.isAuthenticated,
        sessionId: req.session?.id
    });
    
    if (!req.session || !req.session.isAuthenticated) {
        console.log('❌ Доступ запрещен - не авторизован');
        return res.status(401).json({ error: 'Неавторизованный доступ' });
    }
    
    console.log('✅ Доступ разрешен - авторизован');
    next();
};

// Маршрут для входа в админ панель через Supabase Auth
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        
        // Аутентификация через Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: login,
            password: password
        });
        
        if (error) {
            console.error('Ошибка аутентификации Supabase:', error);
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }
        
        if (data.user) {
            // Успешная аутентификация
            req.session.isAuthenticated = true;
            req.session.userId = data.user.id;
            req.session.userEmail = data.user.email;
            
            console.log('✅ Сессия создана:', {
                sessionId: req.session.id,
                isAuthenticated: req.session.isAuthenticated,
                userId: req.session.userId,
                userEmail: req.session.userEmail
            });
            
            res.json({ 
                success: true, 
                message: 'Успешный вход',
                user: {
                    id: data.user.id,
                    email: data.user.email
                }
            });
        } else {
            res.status(401).json({ error: 'Неверный логин или пароль' });
        }
    } catch (error) {
        console.error('Ошибка сервера при аутентификации:', error);
        res.status(500).json({ error: 'Ошибка сервера при аутентификации' });
    }
});

// Маршрут для выхода
router.post('/logout', async (req, res) => {
    try {
        // Выход из Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Ошибка выхода из Supabase:', error);
        }
        
        // Уничтожаем сессию
        req.session.destroy();
        res.json({ success: true, message: 'Выход выполнен' });
    } catch (error) {
        console.error('Ошибка сервера при выходе:', error);
        res.status(500).json({ error: 'Ошибка сервера при выходе' });
    }
});

// Получить статистику клиентов
router.get('/stats', checkAuth, async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        // Получить статистику по типам питомцев
        const { data: petTypes, error: petError } = await supabase
            .from('clients')
            .select('pet_type')
            .not('pet_type', 'is', null);

        if (petError) throw petError;

        const petTypeStats = petTypes.reduce((acc, client) => {
            acc[client.pet_type] = (acc[client.pet_type] || 0) + 1;
            return acc;
        }, {});

        res.json({
            totalClients: count,
            petTypeStats,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить всех клиентов для админа
router.get('/clients', checkAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Экспорт данных клиентов в PDF
router.get('/export', checkAuth, async (req, res) => {
    console.log('🔄 Начинаю генерацию PDF экспорта...');
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log(`📊 Найдено ${data.length} клиентов для экспорта`);

        // Создаем HTML для PDF
        const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Клиенты ветеринарной клиники Федорова</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #4f46e5;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
            font-size: 14px;
        }
        .stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #4f46e5;
        }
        .stats h3 {
            margin: 0 0 10px 0;
            color: #4f46e5;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .stat-item {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th {
            background: #4f46e5;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
        }
        td {
            padding: 10px 8px;
            border-bottom: 1px solid #e9ecef;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        tr:hover {
            background: #e3f2fd;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Ветеринарная клиника Федорова</h1>
        <p>Отчет по клиентам</p>
        <p>Дата генерации: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}</p>
    </div>
    
    <div class="stats">
        <h3>Общая статистика</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-number">${data.length}</div>
                <div class="stat-label">Всего клиентов</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${data.filter(c => c.pet_type === 'собака').length}</div>
                <div class="stat-label">Собак</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${data.filter(c => c.pet_type === 'кошка').length}</div>
                <div class="stat-label">Кошек</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${data.filter(c => c.pet_type === 'птица').length}</div>
                <div class="stat-label">Птиц</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${data.filter(c => c.pet_type === 'грызун').length}</div>
                <div class="stat-label">Грызунов</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${data.filter(c => c.pet_type && !['собака', 'кошка', 'птица', 'грызун'].includes(c.pet_type)).length}</div>
                <div class="stat-label">Других</div>
            </div>
        </div>
    </div>
    
    ${data.length > 0 ? `
    <table>
        <thead>
            <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Питомец</th>
                <th>Тип</th>
                <th>Сообщение</th>
                <th>Дата</th>
            </tr>
        </thead>
        <tbody>
            ${data.map((client, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${client.first_name || ''}</td>
                    <td>${client.last_name || ''}</td>
                    <td>${client.phone || '-'}</td>
                    <td>${client.email || '-'}</td>
                    <td>${client.pet_name || '-'}</td>
                    <td>${client.pet_type || '-'}</td>
                    <td>${client.message ? (client.message.length > 30 ? client.message.substring(0, 30) + '...' : client.message) : '-'}</td>
                    <td>${new Date(client.created_at).toLocaleDateString('ru-RU')}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    ` : `
    <div class="no-data">
        <h3>Данные отсутствуют</h3>
        <p>В базе данных пока нет клиентов</p>
    </div>
    `}
    
    <div class="footer">
        <p>Отчет сгенерирован автоматически системой ветеринарной клиники Федорова</p>
        <p>© 2024 Все права защищены</p>
    </div>
</body>
</html>`;

        // Устанавливаем заголовки для PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=clients_${new Date().toISOString().split('T')[0]}.pdf`);
        
        // Используем html-pdf-node для генерации PDF
        const pdf = require('html-pdf-node');
        const options = {
            format: 'A4',
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            printBackground: true
        };
        
        const file = { content: htmlContent };
        console.log('📄 Генерирую PDF...');
        const pdfBuffer = await pdf.generatePdf(file, options);
        
        console.log(`✅ PDF сгенерирован, размер: ${pdfBuffer.length} байт`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        res.status(500).json({ error: 'Ошибка генерации PDF: ' + error.message });
    }
});

module.exports = router; 