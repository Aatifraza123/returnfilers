require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/adminModel');
const User = require('./models/userModel');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists in Admin collection
    const existingAdmin = await Admin.findOne({ email: 'admin@returnfilers.in' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists in Admin collection!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin in Admin collection
    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@returnfilers.in',
      password: 'Admin@123',
      phone: '08447127264',
      role: 'admin'
    });

    console.log('✅ Admin created in Admin collection successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Collection: admins');

    // Remove admin from User collection if exists
    const adminInUsers = await User.findOne({ email: 'admin@returnfilers.in' });
    if (adminInUsers) {
      await User.deleteOne({ email: 'admin@returnfilers.in' });
      console.log('\n✅ Removed admin from User collection');
    }

    // Show collections
    console.log('\n📊 Collections Summary:');
    const admins = await Admin.find({});
    const users = await User.find({});
    
    console.log('\n👨‍💼 Admins Collection:', admins.length);
    admins.forEach((a, i) => {
      console.log(`${i + 1}. ${a.name} (${a.email})`);
    });
    
    console.log('\n👥 Users Collection:', users.length);
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.email})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAdmin();
