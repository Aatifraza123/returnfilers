require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const users = await User.find({});
    
    console.log('\n📊 Total Users:', users.length);
    console.log('\n👥 User List:\n');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   ID: ${user._id}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
