require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/userModel');

const checkBookings = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Get all bookings
    const bookings = await Booking.find({}).populate('user');
    console.log('\n📊 Total Bookings:', bookings.length);
    
    // Get all users
    const users = await User.find({});
    console.log('📊 Total Users:', users.length);
    
    console.log('\n👥 Users:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Bookings: ${user.bookings?.length || 0}`);
      console.log(`   Quotes: ${user.quotes?.length || 0}`);
      console.log(`   Consultations: ${user.consultations?.length || 0}`);
      console.log('---');
    });

    console.log('\n📋 Bookings:\n');
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. Service: ${booking.service}`);
      console.log(`   Name: ${booking.name}`);
      console.log(`   Email: ${booking.email}`);
      console.log(`   User ID: ${booking.user?._id || 'Not linked'}`);
      console.log(`   User Name: ${booking.user?.name || 'Not linked'}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Documents: ${booking.documents?.length || 0}`);
      console.log(`   Created: ${booking.createdAt}`);
      console.log(`   Booking ID: ${booking._id}`);
      console.log('---');
    });

    // Check if any bookings match user email but aren't linked
    console.log('\n🔍 Checking for unlinked bookings...\n');
    for (const user of users) {
      const unmatchedBookings = bookings.filter(
        b => b.email === user.email && (!b.user || b.user._id.toString() !== user._id.toString())
      );
      
      if (unmatchedBookings.length > 0) {
        console.log(`⚠️  User ${user.name} (${user.email}) has ${unmatchedBookings.length} unlinked bookings`);
        unmatchedBookings.forEach(b => {
          console.log(`   - Booking ID: ${b._id}, Service: ${b.service}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkBookings();
