const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../services/authService');
const { authenticate } = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    const result = await signup(username, email, password);
    
    res.status(201).json({
      message: 'User created successfully',
      ...result
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Signup failed' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    const result = await login(username, password);
    
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    res.status(401).json({ 
      error: error.message || 'Login failed' 
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.userId);
    res.json(user);
  } catch (error) {
    res.status(401).json({ 
      error: error.message || 'User not found' 
    });
  }
});

// Demo endpoint for testing
router.post('/demo', async (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    // Return a simple demo token
    const demoUser = {
      _id: 'demo-user-id',
      username: 'demo',
      email: 'demo@example.com',
      createdAt: new Date()
    };
    
    const token = jwt.sign({ userId: demoUser._id }, JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({
      message: 'Demo login successful',
      user: demoUser,
      token: token
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Demo login failed' 
    });
  }
});

module.exports = router;
