import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    console.log('Auth Headers:', req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        console.log('Token extracted:', token);
        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id).select('-password');
        console.log('Found user:', user);
        
        if (!user) {
          throw new Error('User not found');
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ 
          message: 'Not authorized, token failed',
          error: error.message 
        });
      }
    } else {
      console.log('No token provided in headers');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Auth middleware error',
      error: error.message 
    });
  }
};

// Optional: Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
}; 