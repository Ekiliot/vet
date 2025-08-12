# Ветеринарная клиника Федорова - Тирасполь, ПМР

Современный веб-сайт для ветеринарной клиники с системой учета клиентов и админ-панелью.

## 🚀 Особенности

- **Красивый современный дизайн** с анимациями и адаптивной версткой
- **Система учета клиентов** с интеграцией Supabase
- **Защищенная админ-панель** для просмотра статистики
- **Instagram интеграция** для отображения постов
- **Форма записи на прием** с валидацией
- **Адаптивный дизайн** для всех устройств

## 🛠 Технологии

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **База данных**: Supabase (PostgreSQL)
- **Анимации**: CSS Animations, Intersection Observer
- **Чарты**: Chart.js
- **Иконки**: Font Awesome

## 📋 Требования

- Node.js 16+ 
- npm или yarn
- Аккаунт Supabase

## 🔧 Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd vet-fedorov-pmr
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
Создайте файл `.env` в корневой папке:
```env
# Supabase Configuration (опционально)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin Login Credentials (обязательно)
ADMIN_LOGIN=ваш_логин
ADMIN_PASSWORD=ваш_пароль
SESSION_SECRET=ваш_секретный_ключ_сессии

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Примечание:** Админ-панель требует настройки учетных данных через переменные окружения.

4. **Настройте Supabase**
   - Создайте новый проект в [Supabase](https://supabase.com)
   - Создайте таблицу `clients` со следующей структурой:

```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    pet_name VARCHAR(100),
    pet_type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **Запустите сервер**
```bash
# Режим разработки
npm run dev

# Продакшн режим
npm start
```

## 🌐 Доступ к сайту

- **Основной сайт**: http://localhost:3000
- **Страница входа**: http://localhost:3000/login
- **Админ панель**: http://localhost:3000/admin (только после входа)

## 🔐 Админ панель

Для доступа к админ-панели перейдите по ссылке "Вход" в главном меню или откройте `/login`.

**Учетные данные для входа:**
Учетные данные настраиваются через переменные окружения в файле `.env`:

```env
ADMIN_LOGIN=ваш_логин
ADMIN_PASSWORD=ваш_пароль
SESSION_SECRET=ваш_секретный_ключ_сессии
```

**Важно:** Для безопасности измените стандартные учетные данные на свои собственные.

**Функции админ-панели:**
- Просмотр статистики клиентов
- Список всех клиентов
- Экспорт данных в CSV
- Графики и аналитика

## 📱 Структура проекта

```
vet-fedorov-pmr/
├── public/                 # Статические файлы
│   ├── index.html         # Главная страница
│   ├── admin.html         # Админ панель
│   ├── styles.css         # Основные стили
│   ├── admin-styles.css   # Стили админ панели
│   ├── script.js          # Основной JavaScript
│   └── admin.js           # JavaScript админ панели
├── routes/                 # API маршруты
│   ├── clients.js         # Маршруты для клиентов
│   └── admin.js           # Маршруты для админа
├── config/                 # Конфигурация
│   └── supabase.js        # Настройки Supabase
├── server.js               # Основной сервер
├── package.json            # Зависимости
└── README.md               # Документация
```

## 🎨 Кастомизация

### Цвета
Основные цвета можно изменить в CSS переменных:
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #06b6d4;
    --accent-color: #f59e0b;
}
```

### Instagram посты
Для загрузки реальных постов из Instagram замените заглушку в `server.js` на реальный API.

### Анимации
Все анимации определены в CSS файлах и могут быть легко настроены.

## 📊 API Endpoints

### Клиенты
- `POST /api/clients` - Добавить нового клиента
- `GET /api/clients` - Получить всех клиентов (для персонала)
- `GET /api/clients/stats` - Статистика клиентов

### Админ
- `GET /api/admin/stats` - Статистика для админа
- `GET /api/admin/clients` - Список клиентов для админа
- `GET /api/admin/export` - Экспорт данных в CSV

### Instagram
- `GET /api/instagram-posts` - Посты из Instagram

## 🚀 Деплой

### Heroku
```bash
heroku create your-app-name
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set ADMIN_LOGIN=admin
heroku config:set ADMIN_PASSWORD=your_password
heroku config:set SESSION_SECRET=your_session_secret
git push heroku main
```

### Vercel
```bash
vercel --env SUPABASE_URL=your_url
vercel --env SUPABASE_ANON_KEY=your_key
vercel --env ADMIN_LOGIN=admin
vercel --env ADMIN_PASSWORD=your_password
vercel --env SESSION_SECRET=your_session_secret
```

## 🔒 Безопасность

- Все API endpoints защищены
- Админ панель требует токен авторизации
- CORS настроен для безопасности
- Helmet.js для защиты заголовков

## 📞 Контакты

**Ветеринарная клиника Федорова**
- Адрес: пер. Днестровский 5А/2, Тирасполь, ПМР
- Телефон: 373 775 02222
- Instagram: [@vet_pomosh.pmr](https://instagram.com/vet_pomosh.pmr)

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🤝 Поддержка

Если у вас есть вопросы или предложения, создайте Issue в репозитории.

---

**Создано с ❤️ для ветеринарной клиники Федорова** 