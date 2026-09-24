const { z } = require('zod');
const prisma = require('../utils/prisma');

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { productId: true }
    });
    
    // Return an array of just the productIds to match the frontend array structure
    const productIds = favorites.map(fav => fav.productId);
    res.status(200).json(productIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving favorites' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingFavorite) {
      // It exists, so we remove it
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      res.status(200).json({ message: 'Removed from favorites', action: 'removed', productId });
    } else {
      // It doesn't exist, so we add it
      await prisma.favorite.create({
        data: { userId, productId }
      });
      res.status(200).json({ message: 'Added to favorites', action: 'added', productId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error toggling favorite' });
  }
};

module.exports = {
  getFavorites,
  toggleFavorite
};
