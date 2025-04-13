import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateAllProductImages
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);
router.post('/update-images', authenticateToken, updateAllProductImages);

export default router; 