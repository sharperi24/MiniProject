// routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();

// Test route to check database connection and users
router.get('/test', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    console.log('Retrieved users:', users);
    res.json({
      message: 'Database connection successful',
      userCount: users.length,
      users
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database test failed',
      error: error.message 
    });
  }
});

router.post('/register', register);
router.post('/login', login);

export default router;