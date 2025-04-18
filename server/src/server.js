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
import addressRoutes from './routes/addressRoutes.js';
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
    'http://localhost:5173'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};

app.use(cors(corsOptions));

// Health check endpoint (must be first, before any middleware)
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

// Verify CSRF token middleware
const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'] || req.headers['X-CSRF-Token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];
  
  console.log('CSRF Validation Debug:', {
    path: req.path,
    method: req.method,
    headers: {
      'x-csrf-token': req.headers['x-csrf-token'],
      'X-CSRF-Token': req.headers['X-CSRF-Token'],
      'all-headers': req.headers
    },
    cookies: {
      'XSRF-TOKEN': cookieToken,
      'all-cookies': req.cookies
    }
  });

  if (!csrfToken) {
    console.error('Missing CSRF token in headers');
    return res.status(403).json({ message: 'Missing CSRF token in headers' });
  }

  if (!cookieToken) {
    console.error('Missing CSRF token in cookies');
    return res.status(403).json({ message: 'Missing CSRF token in cookies' });
  }

  if (csrfToken !== cookieToken) {
    console.error('CSRF token mismatch:', {
      headerToken: csrfToken,
      cookieToken: cookieToken
    });
    return res.status(403).json({ message: 'CSRF token mismatch' });
  }

  console.log('CSRF token validated successfully');
  next();
};

// Apply CSRF protection only to auth routes
app.use('/api/auth', (req, res, next) => {
  // Skip CSRF check for health endpoint
  if (req.path === '/health') {
    return next();
  }
  verifyCsrfToken(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
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