require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false
}));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', 1);

// Rate Limiting para Autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 60, // Límite amplio para evitar bloqueos innecesarios en producción/pruebas
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Por favor, inténtelo de nuevo más tarde.' }
});

// Routes
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const settingsRoutes = require('./routes/settings.routes');
const favoritesRoutes = require('./routes/favorites.routes');

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/favorites', favoritesRoutes);

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Creaciones Oly API is running secure.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running securely on http://localhost:${PORT}`);
});
