require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/userModel');

const linkExistingBookings = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    let totalLinked = 0;

    for (const user of users) {
      console.log(`Processing user: ${user.name} (${user.email})`);
      
      // Find all bookings with matching email that aren't linked
      const unmatchedBookings = await Booking.find({
        email: user.email,
        $or: [
          { user: null },
          { user: { $exists: false } }
        ]
      });

      if (unmatchedBookings.length > 0) {
        console.log(`  Found ${unmatchedBookings.length} unlinked bookings`);
        
        for (const booking of unmatchedBookings) {
          // Link booking to user
          booking.user = user._id;
          await booking.save();
          
          // Add booking to user's bookings array if not already there
          if (!user.bookings.includes(booking._id)) {
            user.bookings.push(booking._id);
          }
          
          console.log(`  ✅ Linked booking: ${booking.service} (${booking._id})`);
          totalLinked++;
        }
        
        // Save user with updated bookings array
        await user.save();
        console.log(`  ✅ Updated user's bookings array (${user.bookings.length} total)\n`);
      } else {
        console.log(`  No unlinked bookings found\n`);
      }
    }

    console.log(`\n🎉 Successfully linked ${totalLinked} bookings to users!`);

    // Verify the results
    console.log('\n📊 Verification:\n');
    for (const user of users) {
      const updatedUser = await User.findById(user._id);
      const userBookings = await Booking.find({ user: user._id });
      console.log(`${updatedUser.name}: ${userBookings.length} bookings`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

linkExistingBookings();
