const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { sendConfirmationEmail, sendPasswordResetEmail } = require('../utils/mailer');

// Fase 3: Registro Seguro
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el correo ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Prevención de enumeración de usuarios: devolvemos 200 OK aunque exista
      // En producción real, enviar un email a 'existingUser.email' informando un intento de registro.
      return res.status(200).json({ message: 'Si el correo es válido, recibirás un enlace de confirmación.' });
    }

    // Hashear la contraseña (usamos bcryptjs para simplicidad en Node, o Argon2 si está instalado)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Fase 4: Generar Token de Verificación Seguro
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Si no hay SMTP configurado en el servidor (Fase 1 provisional), auto-activamos la cuenta
    const autoVerify = !process.env.SMTP_HOST;

    // Guardar usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isVerified: autoVerify,
        verificationTokenHash: autoVerify ? null : tokenHash,
        verificationTokenExpires: autoVerify ? null : tokenExpires,
      }
    });

    // Fetch Business Settings for the email branding
    const businessSettings = await prisma.businessSettings.findUnique({ where: { id: 'singleton' } });

    // Enviar email de confirmación (si hay SMTP o simulación)
    await sendConfirmationEmail(email, rawToken, name, businessSettings);

    const message = autoVerify
      ? '¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.'
      : 'Si el correo es válido, recibirás un enlace de confirmación.';

    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Fase 4: Verificación por Email
const verify = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: 'Token requerido' });

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        verificationTokenHash: tokenHash,
        verificationTokenExpires: { gt: new Date() } // Mayor que ahora
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'El enlace de verificación es inválido o ha expirado.' });
    }

    // Activar usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationTokenHash: null,
        verificationTokenExpires: null
      }
    });

    res.status(200).json({ message: 'Cuenta verificada correctamente. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Fase 5: Inicio de Sesión y JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Mensaje genérico para prevenir enumeración
    const genericError = 'Credenciales inválidas';

    if (!user) return res.status(401).json({ message: genericError });
    
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(403).json({ message: 'Cuenta bloqueada temporalmente por intentos fallidos. Intente más tarde.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      // Incrementar intentos fallidos
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 min lock
      
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockedUntil }
      });
      return res.status(401).json({ message: genericError });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Por favor, verifica tu correo electrónico para iniciar sesión.' });
    }

    // Login exitoso: Resetear intentos
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null }
    });

    // Generar JWT (Access Token)
    const payload = { userId: user.id, role: user.role, tokenVersion: user.tokenVersion };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Generar Refresh Token largo en BD
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: refreshHash,
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || '',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      }
    });

    // Enviar cookies HttpOnly compatibles con cross-domain (Vercel <-> Render)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // Requerido para sameSite: 'none' en HTTPS
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    });

    res.status(200).json({ 
      token: accessToken,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Fase 7: Recuperación de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const genericMessage = 'If the email exists, we have sent a recovery link.';

    if (!user) return res.status(200).json({ message: genericMessage });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordTokenExpires: tokenExpires
      }
    });

    // Fetch Business Settings for the email branding
    const businessSettings = await prisma.businessSettings.findUnique({ where: { id: 'singleton' } });

    await sendPasswordResetEmail(email, rawToken, user.name, businessSettings);

    res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordTokenExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'The link is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Al cambiar la contraseña: se invalida token actual y TODAS las sesiones (tokenVersion++)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordTokenHash: null,
        resetPasswordTokenExpires: null,
        tokenVersion: user.tokenVersion + 1, // Fuerza cierre global de sesión
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });

    // Opcional: borrar registros de Session de la tabla
    await prisma.session.deleteMany({ where: { userId: user.id } });

    res.status(200).json({ message: 'Password changed successfully. You must log in again.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
};


const getMe = async (req, res) => {
  // req.user is populated by requireAuth middleware
  res.status(200).json({
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    try {
      const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await prisma.session.deleteMany({ where: { refreshTokenHash: refreshHash } });
    } catch (e) {
      console.error('Error al borrar sesión:', e);
    }
  }

  res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
  res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        tokenVersion: { increment: 1 }
      }
    });

    await prisma.session.deleteMany({ where: { userId: user.id } });

    res.status(200).json({ message: 'Password changed successfully. Please log in again.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  changePassword
};
