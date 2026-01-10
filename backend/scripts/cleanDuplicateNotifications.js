const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const Notification = require('../models/notificationModel');

async function cleanDuplicateNotifications() {
  try {
    console.log('🔍 Searching for duplicate notifications...\n');

    // Find all notifications with relatedId
    const notifications = await Notification.find({ relatedId: { $exists: true } })
      .sort({ createdAt: 1 }); // Keep oldest, remove newer duplicates

    console.log(`Found ${notifications.length} notifications with relatedId\n`);

    // Group by unique key
    const seen = new Map();
    const duplicates = [];

    for (const notif of notifications) {
      // Create unique key: type + relatedId + recipient + recipientId
      const key = `${notif.type}_${notif.relatedId}_${notif.recipient}_${notif.recipientId || 'null'}`;
      
      if (seen.has(key)) {
        // This is a duplicate
        duplicates.push(notif._id);
        console.log(`🔴 Duplicate found: ${notif.type} - ${notif.title} (ID: ${notif._id})`);
      } else {
        // First occurrence, keep it
        seen.set(key, notif._id);
      }
    }

    if (duplicates.length === 0) {
      console.log('\n✅ No duplicate notifications found!');
    } else {
      console.log(`\n⚠️ Found ${duplicates.length} duplicate notifications`);
      console.log('🗑️ Deleting duplicates...\n');

      const result = await Notification.deleteMany({ _id: { $in: duplicates } });
      console.log(`✅ Deleted ${result.deletedCount} duplicate notifications`);
    }

    console.log('\n✨ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning duplicates:', error);
    process.exit(1);
  }
}

cleanDuplicateNotifications();
