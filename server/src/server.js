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

// Health check endpoint
app.get('/health', (req, res) => {
  const csrfToken = Math.random().toString(36).substring(2);
  console.log('Health endpoint - Generated CSRF token:', csrfToken);
  
  res.cookie('XSRF-TOKEN', csrfToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    httpOnly: false
  });
  res.setHeader('X-CSRF-Token', csrfToken);
  
  console.log('Health endpoint - Set CSRF token in response');
  res.status(200).json({ status: 'ok' });
});

// Generate and set CSRF token for all routes
app.use((req, res, next) => {
  const csrfToken = Math.random().toString(36).substring(2);
  console.log('Generated new CSRF token:', csrfToken);
  
  res.cookie('XSRF-TOKEN', csrfToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    httpOnly: false
  });
  res.setHeader('X-CSRF-Token', csrfToken);
  console.log('Set CSRF token in cookie and header');
  next();
});

// Verify CSRF token middleware
const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];
  
  console.log('CSRF Validation:', {
    path: req.path,
    method: req.method,
    headerToken: csrfToken,
    cookieToken: cookieToken,
    allHeaders: req.headers,
    allCookies: req.cookies
  });

  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    console.error('CSRF Token Mismatch:', {
      headerToken: csrfToken,
      cookieToken: cookieToken,
      path: req.path
    });
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  console.log('CSRF token validated successfully');
  next();
};

// Apply CSRF protection to protected routes only
app.use((req, res, next) => {
  const publicRoutes = [
    '/health',
    '/api/products',
    '/api/auth/signup',
    '/api/auth/login',
    '/api/auth/health'
  ];

  if (publicRoutes.some(route => req.path.startsWith(route))) {
    next();
  } else {
    verifyCsrfToken(req, res, next);
  }
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