require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@returnfilers.in' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@returnfilers.in',
      password: 'Admin@123',
      phone: '08447127264',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Role:', admin.role);
    console.log('\n⚠️ Please change the password after first login!');

    // Show all users
    const users = await User.find({});
    console.log('\n📊 Total Users:', users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdminUser();
