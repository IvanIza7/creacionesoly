const express = require('express');
const upload = require('../middlewares/upload');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Endpoint de subida
// Solo accesible para administradores (requireAuth + requireAdmin)
// Recibe un archivo con la llave 'image'
router.post('/', requireAuth, requireAdmin, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'La imagen excede el límite de 2MB.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ninguna imagen.' });
    }

    try {
      // Generar nombre único con formato webp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = req.file.fieldname + '-' + uniqueSuffix + '.webp';
      const uploadsDir = path.join(__dirname, '../../uploads');
      const outputPath = path.join(uploadsDir, filename);

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Procesar la imagen con sharp desde el buffer en memoria
      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Devolver la URL completa de la imagen para que funcione directamente en Vercel
      const host = req.get('host');
      const protocol = req.protocol === 'http' && host.includes('onrender.com') ? 'https' : req.protocol;
      const fileUrl = `${protocol}://${host}/uploads/${filename}`;
      
      res.status(200).json({ 
        message: 'Imagen subida y optimizada exitosamente.',
        url: fileUrl 
      });
    } catch (processError) {
      console.error('Error procesando imagen:', processError);
      res.status(500).json({ message: 'Error procesando la imagen.' });
    }
  });
});

module.exports = router;
