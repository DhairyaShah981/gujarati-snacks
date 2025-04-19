import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import crypto from 'crypto';

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
    'http://localhost:5173'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-csrf-token', 'Accept'],
  exposedHeaders: ['X-CSRF-Token', 'x-csrf-token'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  console.log('Health endpoint - Generated CSRF token:', csrfToken);
  
  // Set CSRF token in cookie with more permissive settings for Safari
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false,  // Allow JavaScript to access the cookie
    secure: true,     // Only send over HTTPS
    sameSite: 'none', // Allow cross-site requests
    path: '/',        // Available across all paths
    maxAge: 3600      // 1 hour expiration
  });
  
  // Set CSRF token in response header
  res.setHeader('X-CSRF-Token', csrfToken);
  console.log('Health endpoint - Set CSRF token in response');
  
  res.json({ status: 'ok' });
});

// CSRF verification middleware
const verifyCsrfToken = (req, res, next) => {
  // Skip CSRF check for health endpoint
  if (req.path === '/api/health') {
    return next();
  }

  // Get token from header (case insensitive)
  const tokenFromHeader = req.headers['x-csrf-token'] || 
                         req.headers['X-CSRF-Token'] || 
                         req.headers['x-csrf-token']?.toLowerCase() || 
                         req.headers['X-CSRF-Token']?.toLowerCase();
  
  const tokenFromCookie = req.cookies['XSRF-TOKEN'];

  // Log CSRF verification details
  console.log('CSRF Validation Debug:', {
    path: req.path,
    method: req.method,
    headers: {
      'x-csrf-token': req.headers['x-csrf-token'],
      'X-CSRF-Token': req.headers['X-CSRF-Token'],
      'all-headers': req.headers
    },
    cookies: {
      'XSRF-TOKEN': tokenFromCookie,
      'all-cookies': req.cookies
    }
  });

  // Verify token
  if (!tokenFromHeader || !tokenFromCookie || tokenFromHeader !== tokenFromCookie) {
    console.error('CSRF token verification failed:', {
      headerToken: tokenFromHeader,
      cookieToken: tokenFromCookie,
      match: tokenFromHeader === tokenFromCookie
    });
    return res.status(403).json({ message: 'CSRF token verification failed' });
  }

  console.log('CSRF token validated successfully');
  next();
};

// Routes
app.use('/api/auth', verifyCsrfToken);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);

// Error handling
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