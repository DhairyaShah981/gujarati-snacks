import express from 'express';
import {
  login,
  signup,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Protected routes
router.post('/logout', authenticateToken, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router; 