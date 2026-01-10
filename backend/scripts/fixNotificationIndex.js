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

async function fixNotificationIndex() {
  try {
    console.log('🔧 Fixing notification indexes...\n');

    // Get all indexes
    const indexes = await Notification.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Drop the old unique index if it exists
    try {
      await Notification.collection.dropIndex('unique_notification_per_entity');
      console.log('✅ Dropped old unique index: unique_notification_per_entity');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Old index does not exist, skipping drop');
      } else {
        console.log('⚠️  Error dropping old index:', error.message);
      }
    }

    // The new index will be created automatically when the model is loaded
    // But we can force it by calling ensureIndexes
    await Notification.ensureIndexes();
    console.log('✅ New indexes created');

    // Verify new indexes
    const newIndexes = await Notification.collection.getIndexes();
    console.log('\nNew indexes:', Object.keys(newIndexes));

    console.log('\n✨ Index fix complete!');
    console.log('📝 Status update notifications will now work properly.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
}

fixNotificationIndex();
