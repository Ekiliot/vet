const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
            contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                scriptSrcAttr: ["'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.unsplash.com"],
                connectSrc: ["'self'"],
                frameSrc: ["'self'", "https://www.instagram.com"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                manifestSrc: ["'self'"]
            }
        }
}));
app.use(compression());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'vet-fedorov-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// API Routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/admin', require('./routes/admin'));

// Middleware для логирования сессий
app.use((req, res, next) => {
    console.log('🌐 Запрос:', {
        method: req.method,
        url: req.url,
        hasSession: !!req.session,
        sessionId: req.session?.id,
        isAuthenticated: req.session?.isAuthenticated
    });
    next();
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Middleware для проверки авторизации
const checkAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    // Вместо редиректа возвращаем 401, чтобы клиент сам обработал
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Instagram posts endpoint (заглушка для демонстрации)
app.get('/api/instagram-posts', (req, res) => {
  res.json([
    {
      id: 1,
      image: '/images/insta1.jpg',
      caption: 'Наши пушистые пациенты всегда в надежных руках! 🐾',
      likes: 45,
      date: '2024-01-15'
    },
    {
      id: 2,
      image: '/images/insta2.jpg',
      caption: 'Современное оборудование для точной диагностики 🔬',
      likes: 32,
      date: '2024-01-14'
    },
    {
      id: 3,
      image: '/images/insta3.jpg',
      caption: 'Заботливый уход за каждым питомцем ❤️',
      likes: 67,
      date: '2024-01-13'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте http://localhost:${PORT} в браузере`);
}); 