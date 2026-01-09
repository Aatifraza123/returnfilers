require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const removePortfolio = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Drop the portfolio collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    const portfolioExists = collections.some(col => col.name === 'portfolios');

    if (portfolioExists) {
      await mongoose.connection.db.dropCollection('portfolios');
      console.log('✅ Portfolio collection removed from database');
    } else {
      console.log('ℹ️  Portfolio collection does not exist');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

removePortfolio();
