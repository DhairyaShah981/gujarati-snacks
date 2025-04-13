export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired'
      });
    }
  
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({
        message: 'Invalid CSRF token'
      });
    }
  
    // Default error
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };