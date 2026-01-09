const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const testAPIFetch = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const User = require('./models/userModel');
    const Notification = require('./models/notificationModel');
    
    // Get a user
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Test User: ${user.name} (ID: ${user._id})`);
    
    // Generate a test JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log(`\nGenerated JWT Token:\n${token}\n`);
    
    // Test the query that the API would use
    const notifications = await Notification.find({
      recipient: 'user',
      recipientId: user._id
    }).sort({ createdAt: -1 });
    
    const unreadCount = await Notification.countDocuments({
      recipient: 'user',
      recipientId: user._id,
      isRead: false
    });
    
    console.log(`Notifications for ${user.name}:`);
    console.log(`- Total: ${notifications.length}`);
    console.log(`- Unread: ${unreadCount}`);
    console.log(`\nNotifications:`);
    notifications.forEach(n => {
      console.log(`  - ${n.title} (Read: ${n.isRead}, Created: ${new Date(n.createdAt).toLocaleString()})`);
    });
    
    console.log('\n✅ API would return this response:');
    console.log(JSON.stringify({
      success: true,
      data: notifications,
      unreadCount
    }, null, 2));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

testAPIFetch();
