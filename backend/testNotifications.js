const mongoose = require('mongoose');
require('dotenv').config();

const testNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Notification = require('./models/notificationModel');
    const User = require('./models/userModel');
    
    // Get all notifications
    const allNotifications = await Notification.find().sort({ createdAt: -1 }).limit(10);
    console.log('Total notifications found:', allNotifications.length);
    console.log('\nLast 10 notifications:');
    allNotifications.forEach(n => {
      console.log(`- Type: ${n.type}, Recipient: ${n.recipient}, RecipientId: ${n.recipientId}, Read: ${n.isRead}, Title: ${n.title}, Created: ${new Date(n.createdAt).toLocaleString()}`);
    });
    
    // Count admin vs user notifications
    const adminCount = await Notification.countDocuments({ recipient: 'admin' });
    const userCount = await Notification.countDocuments({ recipient: 'user' });
    console.log('\n=== Notification Counts ===');
    console.log('Admin notifications:', adminCount);
    console.log('User notifications:', userCount);
    
    // Count unread notifications
    const unreadAdmin = await Notification.countDocuments({ recipient: 'admin', isRead: false });
    const unreadUser = await Notification.countDocuments({ recipient: 'user', isRead: false });
    console.log('\n=== Unread Counts ===');
    console.log('Unread Admin notifications:', unreadAdmin);
    console.log('Unread User notifications:', unreadUser);
    
    // Get all users
    const users = await User.find().limit(5);
    console.log('\n=== Users ===');
    users.forEach(u => {
      console.log(`User: ${u.name} (${u.email}) - ID: ${u._id}`);
    });
    
    // Check user-specific notifications
    if (users.length > 0) {
      const userId = users[0]._id;
      const userNotifs = await Notification.countDocuments({ 
        recipient: 'user',
        recipientId: userId,
        isRead: false 
      });
      console.log(`\nUnread notifications for user ${users[0].name}:`, userNotifs);
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

testNotifications();
