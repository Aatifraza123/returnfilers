const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
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
