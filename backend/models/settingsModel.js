const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Company Info
  companyName: {
    type: String,
    default: 'ReturnFilers'
  },
  email: {
    type: String,
    default: 'info@returnfilers.in'
  },
  phone: {
    type: String,
    default: '+91 84471 27264'
  },
  address: {
    type: String,
    default: ''
  },
  
  // Social Media Links
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    whatsapp: { type: String, default: '' }
  },
  
  // Business Hours
  businessHours: {
    weekdays: { type: String, default: 'Monday - Friday: 9:00 AM - 6:00 PM' },
    saturday: { type: String, default: 'Saturday: 10:00 AM - 2:00 PM' },
    sunday: { type: String, default: 'Sunday: Closed' },
    holidays: { type: String, default: 'Closed on public holidays' }
  },
  
  // SEO Settings
  seo: {
    metaTitle: { type: String, default: 'ReturnFilers - Professional CA Services' },
    metaDescription: { type: String, default: 'Expert Chartered Accountant services for tax filing, GST, auditing, and business registration.' },
    metaKeywords: { type: String, default: 'CA, Chartered Accountant, Tax Filing, GST, Audit' },
    googleAnalyticsId: { type: String, default: '' },
    googleTagManagerId: { type: String, default: '' },
    facebookPixelId: { type: String, default: '' }
  },
  
  // About Company
  about: {
    yearEstablished: { type: Number, default: 2022 },
    yearsOfExperience: { type: Number, default: 3 },
    clientsServed: { type: Number, default: 100 },
    teamSize: { type: Number, default: 5 },
    missionStatement: { type: String, default: '' },
    visionStatement: { type: String, default: '' }
  },
  
  // Policies
  privacyPolicy: {
    type: String,
    default: ''
  },
  termsConditions: {
    type: String,
    default: ''
  },
  refundPolicy: {
    type: String,
    default: ''
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
