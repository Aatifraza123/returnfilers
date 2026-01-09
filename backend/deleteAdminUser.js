require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

const deleteAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Delete user with email admin@ca.com
    const result = await User.deleteOne({ email: 'admin@ca.com' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Admin user deleted successfully!');
    } else {
      console.log('⚠️ Admin user not found');
    }

    // Show remaining users
    const users = await User.find({});
    console.log('\n📊 Remaining Users:', users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteAdminUser();
