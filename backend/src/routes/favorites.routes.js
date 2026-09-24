const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const favoritesController = require('../controllers/favorites.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/', favoritesController.getFavorites);
router.post('/:productId', favoritesController.toggleFavorite);

module.exports = router;
