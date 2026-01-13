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

const newServices = [
  {
    title: 'Trademark Registration',
    description: 'Protect your brand identity with trademark registration. We handle the complete process from search to registration.',
    category: 'Other Services',
    price: 8999,
    timeline: '15-20 Days',
    features: [
      'Trademark Search & Analysis',
      'Application Filing',
      'Response to Objections',
      'Registration Certificate',
      'Brand Protection',
      'Legal Support'
    ],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
    active: true
  },
  {
    title: 'Payroll Management',
    description: 'Complete payroll processing services including salary calculation, tax deductions, and compliance management.',
    category: 'Accounting',
    price: 4999,
    timeline: 'Monthly',
    features: [
      'Salary Processing',
      'TDS Calculation & Filing',
      'PF & ESI Compliance',
      'Payslip Generation',
      'Form 16 Preparation',
      'Statutory Compliance'
    ],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
    active: true
  }
];

async function addServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if services already exist
    for (const serviceData of newServices) {
      const existing = await Service.findOne({ title: serviceData.title });
      if (existing) {
        console.log(`⚠ Service "${serviceData.title}" already exists, skipping...`);
        continue;
      }

      const service = new Service(serviceData);
      await service.save();
      console.log(`✓ Added service: ${serviceData.title}`);
    }

    console.log('\n✓ All services added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding services:', error);
    process.exit(1);
  }
}

addServices();
