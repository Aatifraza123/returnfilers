const mongoose = require('mongoose');
require('dotenv').config();

const checkBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Booking = require('./models/Booking');
    
    // Get all bookings
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10);
    console.log('Total bookings found:', bookings.length);
    console.log('\nBooking details:');
    bookings.forEach(b => {
      console.log(`- Name: ${b.name}, Email: ${b.email}, Service: ${b.service}, User ID: ${b.user}, Created: ${new Date(b.createdAt).toLocaleString()}`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkBookings();
