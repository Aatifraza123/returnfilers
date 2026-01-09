const mongoose = require('mongoose');
require('dotenv').config();

const createTestNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Notification = require('./models/notificationModel');
    const User = require('./models/userModel');
    
    // Get first user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Creating test notifications for user: ${user.name} (${user._id})`);
    
    // Create test notifications
    const notif = await Notification.create({
      type: 'booking',
      title: 'Test Notification',
      message: 'This is a test notification for the user dashboard',
      recipient: 'user',
      recipientId: user._id,
      isRead: false,
      link: '/dashboard'
    });
    
    console.log('✅ Test notification created:', notif._id);
    
    // Check what we created
    const userNotifs = await Notification.find({ 
      recipient: 'user',
      recipientId: user._id
    });
    
    console.log(`\nTotal user notifications for ${user.name}:`, userNotifs.length);
    userNotifs.forEach(n => {
      console.log(`- ${n.title}: ${n.message} (Read: ${n.isRead})`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

createTestNotifications();
