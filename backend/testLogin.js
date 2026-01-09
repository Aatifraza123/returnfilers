require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const user = await User.findOne({ email: 'admin@ca.com' });
    
    if (user) {
      console.log('✅ Admin user exists:');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Is Admin:', user.isAdmin);
      console.log('\n📝 Login Credentials:');
      console.log('Email: admin@ca.com');
      console.log('Password: password123');
      console.log('\n🔗 Login URL: http://localhost:5174/admin/login');
    } else {
      console.log('❌ Admin user not found. Run: node seedAdmin.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
