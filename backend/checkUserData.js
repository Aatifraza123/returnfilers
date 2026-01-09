require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Quote = require('./models/quoteModel');
const Consultation = require('./models/Consultation');
const User = require('./models/userModel');

const checkUserData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    const email = 'razaaatif25@gmail.com';
    
    // Check if user exists
    const user = await User.findOne({ email });
    console.log('👤 User:', user ? `${user.name} (${user._id})` : 'Not found');
    
    // Find all bookings
    const bookings = await Booking.find({ email });
    console.log(`\n📦 Bookings: ${bookings.length}`);
    bookings.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.service} - ${b.status} (${b._id})`);
    });
    
    // Find all quotes
    const quotes = await Quote.find({ email });
    console.log(`\n💰 Quotes: ${quotes.length}`);
    quotes.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.service} - ${q.status} (${q._id})`);
    });
    
    // Find all consultations
    const consultations = await Consultation.find({ email });
    console.log(`\n💬 Consultations: ${consultations.length}`);
    consultations.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.service} - ${c.status} (${c._id})`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('Total Data:');
    console.log(`  Bookings: ${bookings.length}`);
    console.log(`  Quotes: ${quotes.length}`);
    console.log(`  Consultations: ${consultations.length}`);
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUserData();
