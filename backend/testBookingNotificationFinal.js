const mongoose = require('mongoose');
require('dotenv').config();

const testBookingNotificationCreation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Booking = require('./models/Booking');
    const Notification = require('./models/notificationModel');
    const User = require('./models/userModel');
    const { createBookingNotification } = require('./utils/notificationHelper');
    
    // Get a user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Test user: ${user.name} (${user._id})\n`);
    
    // Create a test booking
    const testBooking = await Booking.create({
      user: user._id,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      service: 'Test Service',
      message: 'This is a test booking'
    });
    
    console.log(`Created test booking: ${testBooking._id}`);
    
    // Delete any existing notifications for this booking
    await Notification.deleteMany({ relatedId: testBooking._id });
    console.log('Cleared existing notifications for this booking\n');
    
    // Call the notification function with userId explicitly
    console.log('Creating notifications...');
    await createBookingNotification({ ...testBooking.toObject(), user: user._id });
    
    // Check what notifications were created
    const notifs = await Notification.find({ relatedId: testBooking._id });
    console.log(`\nNotifications created: ${notifs.length}`);
    notifs.forEach(n => {
      console.log(`  - Type: ${n.type}, Recipient: ${n.recipient}, Title: ${n.title}`);
      if (n.recipientId) {
        console.log(`    RecipientId: ${n.recipientId}`);
      }
    });
    
    // Check user-specific notifications
    const userNotifs = await Notification.find({
      recipient: 'user',
      recipientId: user._id
    });
    console.log(`\nTotal user notifications: ${userNotifs.length}`);
    
    // Clean up
    await Booking.deleteOne({ _id: testBooking._id });
    console.log('\n✅ Test completed and test booking cleaned up');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

testBookingNotificationCreation();
