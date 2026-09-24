const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const rateLimit = require('express-rate-limit');
const { requireAuth, requireAdmin } = require('../middlewares/auth');

// Rate limiting: max 3 requests per 15 minutes per IP
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: 'Demasiados intentos de suscripción. Por favor, inténtalo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Regex to check for common typos in domains
const typosRegex = /@(gamil\.com|hotnail\.com|outlok\.com|yahooo\.com)$/i;

router.post('/subscribe', subscribeLimiter, async (req, res) => {
  try {
    const { email, bot_field, privacy_consent } = req.body;

    // 1. Honeypot check (Anti-Bot)
    if (bot_field) {
      // Si el campo invisible se llena, es un bot.
      // Simulamos un éxito para no darle pistas al bot.
      return res.status(200).json({ message: '¡Gracias por suscribirte!' });
    }

    // 2. Validations
    if (!privacy_consent) {
      return res.status(400).json({ message: 'Debes aceptar la política de privacidad.' });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Correo electrónico inválido.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Longitud razonable
    if (cleanEmail.length < 5 || cleanEmail.length > 100) {
      return res.status(400).json({ message: 'La longitud del correo no es válida.' });
    }

    // Formato RFC básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'El formato del correo es incorrecto.' });
    }

    // Typos comunes
    const match = cleanEmail.match(typosRegex);
    if (match) {
      return res.status(400).json({ 
        message: `Parece que hay un error de escritura. ¿Quisiste decir algo distinto a ${match[1]}?` 
      });
    }

    // 3. Database operations
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail }
    });

    if (existing) {
      if (existing.isActive) {
        // Idempotencia: Si ya está, mensaje amigable sin crear error ni registrar doble
        return res.status(200).json({ message: 'Este correo ya se encuentra registrado para recibir nuestras novedades.' });
      } else {
        // Si estaba inactivo, lo reactivamos
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: { isActive: true, unsubscribedAt: null }
        });
        return res.status(200).json({ message: '¡Gracias por suscribirte de nuevo!' });
      }
    }

    // Insertar nuevo suscriptor
    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        source: 'Footer'
      }
    });

    return res.status(200).json({ message: '¡Gracias por suscribirte! A partir de ahora te enviaremos información sobre nuevos productos, promociones y novedades.' });
    
  } catch (error) {
    console.error('Error en suscripción newsletter:', error);
    res.status(500).json({ message: 'Ocurrió un error interno. Por favor, intenta de nuevo.' });
  }
});

// Admin Route: Get Subscribers with pagination
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.newsletterSubscriber.count()
    ]);

    res.json({
      subscribers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error);
    res.status(500).json({ message: 'Error al obtener el historial de suscripciones.' });
  }
});

module.exports = router;
