const mongoose = require('mongoose');
require('dotenv').config();

const testNotificationCreation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Notification = require('./models/notificationModel');
    const Booking = require('./models/Booking');
    const { createBookingNotification } = require('./utils/notificationHelper');
    
    // Get the first booking
    const booking = await Booking.findOne().populate('user');
    
    if (!booking) {
      console.log('No bookings found');
      await mongoose.connection.close();
      return;
    }
    
    console.log('Test booking:');
    console.log(`- ID: ${booking._id}`);
    console.log(`- Name: ${booking.name}`);
    console.log(`- User ID: ${booking.user}`);
    console.log(`- Service: ${booking.service}`);
    
    // Clear notifications for this booking first
    await Notification.deleteMany({ relatedId: booking._id });
    console.log('\nCleared existing notifications for this booking');
    
    // Create notifications
    console.log('\nCreating notifications...');
    await createBookingNotification(booking);
    
    // Check what was created
    const notifs = await Notification.find({ relatedId: booking._id });
    console.log('\nNotifications created:', notifs.length);
    notifs.forEach(n => {
      console.log(`- Type: ${n.type}, Recipient: ${n.recipient}, RecipientId: ${n.recipientId}, Title: ${n.title}`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

testNotificationCreation();
