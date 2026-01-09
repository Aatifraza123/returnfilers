require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Quote = require('./models/quoteModel');
const Consultation = require('./models/Consultation');
const User = require('./models/userModel');

const linkExistingData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    let totalLinked = {
      bookings: 0,
      quotes: 0,
      consultations: 0
    };

    for (const user of users) {
      console.log(`\n📋 Processing user: ${user.name} (${user.email})`);
      
      // === BOOKINGS ===
      const unmatchedBookings = await Booking.find({
        email: user.email,
        $or: [
          { user: null },
          { user: { $exists: false } }
        ]
      });

      if (unmatchedBookings.length > 0) {
        console.log(`  📦 Found ${unmatchedBookings.length} unlinked bookings`);
        
        for (const booking of unmatchedBookings) {
          booking.user = user._id;
          await booking.save();
          
          if (!user.bookings.includes(booking._id)) {
            user.bookings.push(booking._id);
          }
          
          console.log(`    ✅ Linked booking: ${booking.service}`);
          totalLinked.bookings++;
        }
      }

      // === QUOTES ===
      const unmatchedQuotes = await Quote.find({
        email: user.email,
        $or: [
          { user: null },
          { user: { $exists: false } }
        ]
      });

      if (unmatchedQuotes.length > 0) {
        console.log(`  💰 Found ${unmatchedQuotes.length} unlinked quotes`);
        
        for (const quote of unmatchedQuotes) {
          quote.user = user._id;
          await quote.save();
          
          if (!user.quotes.includes(quote._id)) {
            user.quotes.push(quote._id);
          }
          
          console.log(`    ✅ Linked quote: ${quote.service}`);
          totalLinked.quotes++;
        }
      }

      // === CONSULTATIONS ===
      const unmatchedConsultations = await Consultation.find({
        email: user.email,
        $or: [
          { user: null },
          { user: { $exists: false } }
        ]
      });

      if (unmatchedConsultations.length > 0) {
        console.log(`  💬 Found ${unmatchedConsultations.length} unlinked consultations`);
        
        for (const consultation of unmatchedConsultations) {
          consultation.user = user._id;
          await consultation.save();
          
          if (!user.consultations.includes(consultation._id)) {
            user.consultations.push(consultation._id);
          }
          
          console.log(`    ✅ Linked consultation: ${consultation.service}`);
          totalLinked.consultations++;
        }
      }

      // Save user with updated arrays
      await user.save();
      console.log(`  ✅ Updated user's data (${user.bookings.length} bookings, ${user.quotes.length} quotes, ${user.consultations.length} consultations)`);
    }

    console.log(`\n\n🎉 Successfully linked data to users!`);
    console.log(`   📦 Bookings: ${totalLinked.bookings}`);
    console.log(`   💰 Quotes: ${totalLinked.quotes}`);
    console.log(`   💬 Consultations: ${totalLinked.consultations}`);

    // Verify the results
    console.log('\n📊 Final Verification:\n');
    for (const user of users) {
      const updatedUser = await User.findById(user._id);
      const userBookings = await Booking.find({ user: user._id });
      const userQuotes = await Quote.find({ user: user._id });
      const userConsultations = await Consultation.find({ user: user._id });
      
      console.log(`${updatedUser.name}:`);
      console.log(`  📦 ${userBookings.length} bookings`);
      console.log(`  💰 ${userQuotes.length} quotes`);
      console.log(`  💬 ${userConsultations.length} consultations`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

linkExistingData();
