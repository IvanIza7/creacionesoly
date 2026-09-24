const express = require('express');
const { z } = require('zod');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Esquemas Zod
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Formato de correo inválido"),
    password: z.string().min(12, "La contraseña debe tener al menos 12 caracteres (recomendación NIST)")
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de correo inválido"),
    password: z.string().min(1, "Contraseña requerida")
  })
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de correo inválido")
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token requerido"),
    newPassword: z.string().min(12, "La contraseña debe tener al menos 12 caracteres (recomendación NIST)")
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(12, "New password must be at least 12 characters")
  })
});

// Rutas (Fase 3, 4 y 5)
router.post('/register', validate(registerSchema), authController.register);
router.get('/verify', authController.verify);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);

// Rutas (Fase 7)
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.put('/change-password', requireAuth, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
