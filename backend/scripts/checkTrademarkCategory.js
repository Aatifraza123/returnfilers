const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number },
  timeline: { type: String },
  features: [String],
  image: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

async function checkTrademark() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const trademark = await Service.findOne({ title: 'Trademark Registration' });
    
    if (trademark) {
      console.log('📋 Trademark Registration Details:');
      console.log('   Title:', trademark.title);
      console.log('   Category:', trademark.category);
      console.log('   Price:', trademark.price);
      console.log('   Timeline:', trademark.timeline);
      console.log('   Active:', trademark.active);
      console.log('   Features:', trademark.features.length, 'items');
      
      if (trademark.category !== 'Other Services') {
        console.log('\n⚠️  Updating category to "Other Services"...');
        trademark.category = 'Other Services';
        await trademark.save();
        console.log('✓ Category updated successfully!');
      } else {
        console.log('\n✓ Already in "Other Services" category!');
      }
    } else {
      console.log('❌ Trademark Registration not found in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTrademark();
