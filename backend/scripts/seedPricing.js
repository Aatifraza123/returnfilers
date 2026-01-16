require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Pricing = require('../models/Pricing');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const pricingData = [
  // TAX FILING SERVICES
  {
    category: 'tax',
    categoryTitle: 'Tax Filing Services',
    categoryIcon: 'FaFileInvoiceDollar',
    name: 'Basic ITR',
    price: '499',
    popular: false,
    description: 'For salaried individuals with simple tax returns',
    features: [
      'ITR-1 or ITR-2 filing',
      'Single salary income',
      'Basic deductions (80C, 80D)',
      'Form 16 assistance',
      'E-filing & verification',
      '1 month support',
    ],
    notIncluded: [
      'Capital gains',
      'Business income',
      'Multiple properties',
    ],
    billingCycle: 'one-time',
    order: 1,
  },
  {
    category: 'tax',
    categoryTitle: 'Tax Filing Services',
    categoryIcon: 'FaFileInvoiceDollar',
    name: 'Standard ITR',
    price: '999',
    popular: true,
    description: 'For individuals with multiple income sources',
    features: [
      'All ITR forms supported',
      'Multiple salary sources',
      'Capital gains (stocks, MF)',
      'House property income',
      'All deductions & exemptions',
      'Tax planning advice',
      '3 months support',
    ],
    notIncluded: [
      'Business income',
      'Audit requirements',
    ],
    billingCycle: 'one-time',
    order: 2,
  },
  {
    category: 'tax',
    categoryTitle: 'Tax Filing Services',
    categoryIcon: 'FaFileInvoiceDollar',
    name: 'Business ITR',
    price: '2999',
    popular: false,
    description: 'For business owners and professionals',
    features: [
      'ITR-3 or ITR-4 filing',
      'Business/Professional income',
      'Presumptive taxation',
      'Balance sheet preparation',
      'All income sources',
      'Tax optimization',
      'Notice handling',
      '6 months support',
    ],
    notIncluded: [],
    billingCycle: 'one-time',
    order: 3,
  },

  // GST SERVICES
  {
    category: 'gst',
    categoryTitle: 'GST Services',
    categoryIcon: 'FaBalanceScale',
    name: 'GST Registration',
    price: '2999',
    popular: false,
    description: 'One-time GST registration service',
    features: [
      'GST registration application',
      'Document preparation',
      'ARN generation',
      'Certificate download',
      'Digital signature support',
      'Query resolution',
    ],
    notIncluded: [],
    billingCycle: 'one-time',
    order: 1,
  },
  {
    category: 'gst',
    categoryTitle: 'GST Services',
    categoryIcon: 'FaBalanceScale',
    name: 'Monthly GST Filing',
    price: '999',
    popular: true,
    description: 'Per month GST return filing',
    features: [
      'GSTR-1 filing',
      'GSTR-3B filing',
      'Input tax credit reconciliation',
      'Invoice management',
      'Compliance calendar',
      'Dedicated support',
    ],
    notIncluded: [],
    billingCycle: 'monthly',
    order: 2,
  },
  {
    category: 'gst',
    categoryTitle: 'GST Services',
    categoryIcon: 'FaBalanceScale',
    name: 'Annual GST Package',
    price: '9999',
    popular: false,
    description: 'Complete GST compliance for 1 year',
    features: [
      'All monthly returns (12 months)',
      'Annual return (GSTR-9)',
      'Reconciliation statement',
      'ITC optimization',
      'Notice handling',
      'Tax planning',
      'Priority support',
    ],
    notIncluded: [],
    billingCycle: 'yearly',
    order: 3,
  },

  // COMPANY REGISTRATION
  {
    category: 'company',
    categoryTitle: 'Company Registration',
    categoryIcon: 'FaBuilding',
    name: 'Proprietorship',
    price: '2999',
    popular: false,
    description: 'Simple business structure for individuals',
    features: [
      'Business registration',
      'PAN & TAN application',
      'GST registration',
      'Bank account opening support',
      'Basic compliance guide',
    ],
    notIncluded: [
      'Limited liability',
      'Separate legal entity',
    ],
    billingCycle: 'one-time',
    order: 1,
  },
  {
    category: 'company',
    categoryTitle: 'Company Registration',
    categoryIcon: 'FaBuilding',
    name: 'LLP Registration',
    price: '9999',
    popular: true,
    description: 'Limited Liability Partnership',
    features: [
      'Name approval (2 options)',
      'DIN & DSC for partners',
      'LLP agreement drafting',
      'Incorporation certificate',
      'PAN & TAN',
      'First year compliance',
      '1 year support',
    ],
    notIncluded: [],
    billingCycle: 'one-time',
    order: 2,
  },
  {
    category: 'company',
    categoryTitle: 'Company Registration',
    categoryIcon: 'FaBuilding',
    name: 'Private Limited',
    price: '14999',
    popular: false,
    description: 'Most preferred business structure',
    features: [
      'Name approval (3 options)',
      'DIN & DSC for directors',
      'MOA & AOA drafting',
      'Incorporation certificate',
      'PAN, TAN & GST',
      'Share certificates',
      'First year compliance',
      '1 year support',
    ],
    notIncluded: [],
    billingCycle: 'one-time',
    order: 3,
  },

  // ADVISORY SERVICES
  {
    category: 'advisory',
    categoryTitle: 'Advisory Services',
    categoryIcon: 'FaChartLine',
    name: 'Basic Consultation',
    price: '999',
    popular: false,
    description: 'One-time expert consultation',
    features: [
      '30-minute consultation',
      'Tax planning advice',
      'Compliance guidance',
      'Email summary',
    ],
    notIncluded: [
      'Implementation support',
      'Follow-up calls',
    ],
    billingCycle: 'one-time',
    order: 1,
  },
  {
    category: 'advisory',
    categoryTitle: 'Advisory Services',
    categoryIcon: 'FaChartLine',
    name: 'Monthly Retainer',
    price: '4999',
    popular: true,
    description: 'Ongoing advisory support',
    features: [
      'Unlimited consultations',
      'Tax planning & optimization',
      'Compliance management',
      'Financial advisory',
      'Priority support',
      'Monthly review calls',
    ],
    notIncluded: [],
    billingCycle: 'monthly',
    order: 2,
  },
  {
    category: 'advisory',
    categoryTitle: 'Advisory Services',
    categoryIcon: 'FaChartLine',
    name: 'Annual Package',
    price: '49999',
    popular: false,
    description: 'Complete financial management',
    features: [
      'All monthly services',
      'Dedicated account manager',
      'Quarterly business review',
      'Tax audit support',
      'Notice handling',
      'Strategic planning',
      '24/7 priority support',
    ],
    notIncluded: [],
    billingCycle: 'yearly',
    order: 3,
  },
];

const seedPricing = async () => {
  try {
    await connectDB();
    
    // Clear existing pricing data
    await Pricing.deleteMany({});
    console.log('🗑️  Cleared existing pricing data');
    
    // Insert new pricing data
    await Pricing.insertMany(pricingData);
    console.log('✅ Pricing data seeded successfully!');
    console.log(`📊 Total plans added: ${pricingData.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pricing data:', error);
    process.exit(1);
  }
};

seedPricing();
