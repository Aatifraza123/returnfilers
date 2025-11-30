require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const connectDB = require('./config/db');

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@ca.com' });
    
    if (existingUser) {
      console.log('User already exists! Deleting and recreating...');
      await User.deleteOne({ email: 'admin@ca.com' });
    }
    
    // Create new admin user
    const user = await User.create({
      name: 'Admin',
      email: 'admin@ca.com',
      password: 'password123',
      isAdmin: true
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@ca.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();











