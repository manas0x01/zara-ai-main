const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (for the dashboard)
app.use(express.static(__dirname));

// Direct MongoDB connection for testing
const MONGODB_URI = 'mongodb://localhost:27017/zara-ai';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: zara-ai`);
    console.log(`🔗 Connection: localhost:27017`);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Simple User model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Routes for viewing data
app.get('/api/database/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const verifiedCount = await User.countDocuments({ isEmailVerified: true });
    const unverifiedCount = await User.countDocuments({ isEmailVerified: false });
    
    // Get collections info  
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    res.json({
      success: true,
      database: {
        name: 'zara-ai',
        host: 'localhost:27017',
        status: 'connected'
      },
      collections: collections.map(c => c.name),
      users: {
        total: userCount,
        verified: verifiedCount,
        unverified: unverifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/database/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'MongoDB Data Viewer API',
    endpoints: [
      'GET / - Interactive Dashboard',
      'GET /api/database/stats - Database statistics',
      'GET /api/database/users - List all users'
    ]
  });
});

const PORT = 5001; // Using different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`🚀 Data Viewer Server running on http://localhost:${PORT}`);
  console.log(`📊 Database Stats: http://localhost:${PORT}/api/database/stats`);
  console.log(`👥 Users Data: http://localhost:${PORT}/api/database/users`);
});
