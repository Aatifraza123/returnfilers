const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const testUserNotificationAPI = async () => {
  try {
    console.log('🔍 Testing User Notification API...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = require('./models/userModel');
    const Notification = require('./models/notificationModel');

    // Get first user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Create a user first.');
      await mongoose.connection.close();
      return;
    }

    console.log(`📌 Test User: ${user.name} (${user._id})\n`);

    // Generate a token for the user (same way as in login)
    const jwt = require('jsonwebtoken');
    const userToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log(`🔐 Generated User Token: ${userToken.substring(0, 20)}...\n`);

    // Check notifications in DB for this user
    const userNotifs = await Notification.find({ 
      recipient: 'user',
      recipientId: user._id 
    });
    console.log(`📊 Notifications in DB for user: ${userNotifs.length}`);
    userNotifs.forEach(n => {
      console.log(`   - Type: ${n.type}, Title: ${n.title}, Read: ${n.isRead}`);
    });
    console.log();

    // Test API call
    console.log('🌐 Calling API: GET /notifications/user\n');
    const response = await axios.get('http://localhost:5000/api/notifications/user', {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    console.log('✅ API Response:');
    console.log(`   Success: ${response.data.success}`);
    console.log(`   Notifications: ${response.data.data?.length || 0}`);
    console.log(`   Unread Count: ${response.data.unreadCount}`);

    if (response.data.data?.length > 0) {
      console.log('\n📋 Notifications:');
      response.data.data.forEach(n => {
        console.log(`   - ${n.type}: ${n.title} (${n.isRead ? 'read' : 'unread'})`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testUserNotificationAPI();
