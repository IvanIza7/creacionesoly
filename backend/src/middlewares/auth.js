const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const requireAuth = async (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autenticado. Token faltante.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validar sesión contra base de datos real (importante para revocar accesos)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, tokenVersion: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario ya no existe' });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Sesión revocada. Vuelve a iniciar sesión.' });
    }

    req.user = user;
    next();
  } catch (error) {
    // Si el token expira o es inválido
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // 403 Forbidden: Estás autenticado pero no tienes permisos.
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

module.exports = {
  requireAuth,
  requireAdmin
};
