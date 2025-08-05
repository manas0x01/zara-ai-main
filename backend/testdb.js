const mongoose = require('mongoose');
require('dotenv').config();

// Simple script to test MongoDB connection and show data
async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Get database info
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Database Info:');
    console.log(`Database Name: ${db.databaseName}`);
    console.log(`Collections: ${collections.map(c => c.name).join(', ') || 'None'}`);
    
    // Check if users collection exists and show some stats
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    const verifiedCount = await User.countDocuments({ isEmailVerified: true });
    
    console.log('\n👥 User Statistics:');
    console.log(`Total Users: ${userCount}`);
    console.log(`Verified Users: ${verifiedCount}`);
    console.log(`Unverified Users: ${userCount - verifiedCount}`);
    
    // Show recent users (without sensitive data)
    if (userCount > 0) {
      const recentUsers = await User.find({})
        .select('firstName lastName email isEmailVerified createdAt')
        .sort({ createdAt: -1 })
        .limit(5);
      
      console.log('\n📋 Recent Users:');
      recentUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.isEmailVerified ? '✅ Verified' : '❌ Unverified'} - ${user.createdAt.toLocaleDateString()}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
