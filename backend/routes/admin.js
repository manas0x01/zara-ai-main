const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users (for development/testing only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password -__v');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const verifiedCount = await User.countDocuments({ isEmailVerified: true });
    const unverifiedCount = await User.countDocuments({ isEmailVerified: false });
    
    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        verifiedUsers: verifiedCount,
        unverifiedUsers: unverifiedCount,
        databaseName: 'zara-ai',
        collections: ['users']
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching database statistics',
      error: error.message
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

module.exports = router;
