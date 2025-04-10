import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  console.log('\n=== Auth Middleware ===');
  console.log('Request Path:', req.path);
  console.log('Request Method:', req.method);
  console.log('Headers:', {
    'x-csrf-token': req.headers['x-csrf-token'],
    'content-type': req.headers['content-type'],
    'cookie': req.headers['cookie']
  });
  console.log('Cookies:', req.cookies);

  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log('Tokens:', {
      accessToken: accessToken ? 'Present' : 'Missing',
      refreshToken: refreshToken ? 'Present' : 'Missing'
    });

    if (!accessToken && !refreshToken) {
      console.log('No tokens found');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      let decoded;
      if (accessToken) {
        decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log('Access Token Verified:', { userId: decoded.id });
      } else if (refreshToken) {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log('Refresh Token Verified:', { userId: decoded.id });
        // Generate new access token
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
          expiresIn: '15m',
        });
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });
        console.log('New Access Token Generated');
      }

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      console.log('User authenticated:', { userId: user._id });
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
}; 