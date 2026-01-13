const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

async function movePayrollBack() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const payroll = await Service.findOne({ title: 'Payroll Management' });
    
    if (payroll) {
      console.log('📋 Current Category:', payroll.category);
      payroll.category = 'Accounting';
      await payroll.save();
      console.log('✓ Payroll moved back to "Accounting"!');
    } else {
      console.log('❌ Payroll Management not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

movePayrollBack();
