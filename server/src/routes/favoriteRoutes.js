import express from 'express';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/add', protect, addToFavorites);
router.delete('/remove/:productId', protect, removeFromFavorites);
router.get('/check/:productId', protect, checkFavorite);

export default router; 