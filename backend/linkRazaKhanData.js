require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Quote = require('./models/quoteModel');
const Consultation = require('./models/Consultation');
const User = require('./models/userModel');

const linkRazaKhanData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    const email = 'razaaatif25@gmail.com';
    
    // Get user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log(`👤 User: ${user.name} (${user._id})\n`);
    
    let linked = { bookings: 0, quotes: 0, consultations: 0 };
    
    // Link Bookings
    const bookings = await Booking.find({
      email,
      $or: [{ user: null }, { user: { $exists: false } }]
    });
    
    console.log(`📦 Linking ${bookings.length} bookings...`);
    for (const booking of bookings) {
      booking.user = user._id;
      await booking.save();
      
      if (!user.bookings.includes(booking._id)) {
        user.bookings.push(booking._id);
      }
      
      console.log(`  ✅ ${booking.service}`);
      linked.bookings++;
    }
    
    // Link Quotes
    const quotes = await Quote.find({
      email,
      $or: [{ user: null }, { user: { $exists: false } }]
    });
    
    console.log(`\n💰 Linking ${quotes.length} quotes...`);
    for (const quote of quotes) {
      quote.user = user._id;
      await quote.save();
      
      if (!user.quotes.includes(quote._id)) {
        user.quotes.push(quote._id);
      }
      
      console.log(`  ✅ ${quote.service}`);
      linked.quotes++;
    }
    
    // Link Consultations
    const consultations = await Consultation.find({
      email,
      $or: [{ user: null }, { user: { $exists: false } }]
    });
    
    console.log(`\n💬 Linking ${consultations.length} consultations...`);
    for (const consultation of consultations) {
      consultation.user = user._id;
      await consultation.save();
      
      if (!user.consultations.includes(consultation._id)) {
        user.consultations.push(consultation._id);
      }
      
      console.log(`  ✅ ${consultation.service}`);
      linked.consultations++;
    }
    
    // Save user
    await user.save();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Successfully linked:');
    console.log(`  📦 Bookings: ${linked.bookings}`);
    console.log(`  💰 Quotes: ${linked.quotes}`);
    console.log(`  💬 Consultations: ${linked.consultations}`);
    console.log('='.repeat(50));
    
    console.log(`\n👤 User now has:`);
    console.log(`  📦 ${user.bookings.length} bookings`);
    console.log(`  💰 ${user.quotes.length} quotes`);
    console.log(`  💬 ${user.consultations.length} consultations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

linkRazaKhanData();
