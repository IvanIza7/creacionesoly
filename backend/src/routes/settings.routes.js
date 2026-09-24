const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { requireAuth, requireAdmin } = require('../middlewares/auth');

// Seed helper
const ensureSingleton = async () => {
  const settings = await prisma.businessSettings.findUnique({
    where: { id: 'singleton' }
  });
  if (!settings) {
    await prisma.businessSettings.create({
      data: {
        id: 'singleton'
      }
    });
  }
};

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    await ensureSingleton();
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'singleton' }
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching business settings' });
  }
});

// PUT /api/settings - Admin Only
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    await ensureSingleton();
    const data = req.body;
    
    // Validar el número de WhatsApp usando un Regex simple para números internacionales
    if (data.whatsappNumber) {
      const waRegex = /^\+?[1-9]\d{1,14}$/;
      // Limpiamos los espacios por si el admin los introdujo
      const cleanWa = data.whatsappNumber.replace(/\s+/g, '');
      if (!waRegex.test(cleanWa)) {
         return res.status(400).json({ message: 'Número de WhatsApp inválido. Usa formato internacional sin espacios (ej. 1234567890).' });
      }
      data.whatsappNumber = cleanWa;
    }

    const updated = await prisma.businessSettings.update({
      where: { id: 'singleton' },
      data: {
        businessName: data.businessName,
        whatsappNumber: data.whatsappNumber,
        defaultWhatsappMessage: data.defaultWhatsappMessage,
        contactEmail: data.contactEmail,
        address: data.address,
        businessHours: data.businessHours,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        tiktokUrl: data.tiktokUrl,
        siteConfigJson: data.siteConfigJson !== undefined ? data.siteConfigJson : undefined,
        productsJson: data.productsJson !== undefined ? data.productsJson : undefined,
        catalogsJson: data.catalogsJson !== undefined ? data.catalogsJson : undefined,
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating business settings' });
  }
});

module.exports = router;
