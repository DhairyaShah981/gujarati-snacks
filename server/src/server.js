import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: [
    'https://gujarati-snacks.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token']
};

app.use(cors(corsOptions));

// Generate and set CSRF token
app.use((req, res, next) => {
  const csrfToken = Math.random().toString(36).substring(2);
  res.cookie('XSRF-TOKEN', csrfToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    httpOnly: true
  });
  res.setHeader('X-CSRF-Token', csrfToken);
  next();
});

// Verify CSRF token middleware
const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];

  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
};

// Apply CSRF protection to all routes except health check
app.use((req, res, next) => {
  if (req.path === '/health') {
    next();
  } else {
    verifyCsrfToken(req, res, next);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 