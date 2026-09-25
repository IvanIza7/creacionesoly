const express = require('express');
const upload = require('../middlewares/upload');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const sharp = require('sharp');
const supabase = require('../utils/supabase');

const router = express.Router();

const BUCKET = 'product-images';

router.post('/', requireAuth, requireAdmin, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'La imagen excede el límite de 2MB.'
        });
      }

      return res.status(400).json({
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No se envió ninguna imagen.'
      });
    }

    try {
      // Generar nombre único
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1E9);

      const filename = `product-${uniqueSuffix}.webp`;

      // Optimizar la imagen con Sharp
      const webpBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      // Subir la imagen a Supabase Storage
      const { data: uploadedFile, error: uploadError } =
        await supabase.storage
          .from(BUCKET)
          .upload(filename, webpBuffer, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: false
          });

      if (uploadError) {
        console.error('Error subiendo a Supabase Storage:', uploadError);
        throw uploadError;
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(uploadedFile.path);

      const fileUrl = publicUrlData.publicUrl;

      console.log('Imagen subida correctamente:', fileUrl);

      return res.status(200).json({
        message: 'Imagen subida y optimizada exitosamente.',
        url: fileUrl,
        path: uploadedFile.path
      });

    } catch (processError) {
      console.error(
        'Error procesando/subiendo imagen:',
        processError
      );

      return res.status(500).json({
        message: 'Error procesando o guardando la imagen.'
      });
    }
  });
});

module.exports = router;