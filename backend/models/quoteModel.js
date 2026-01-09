const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional because some quotes might be from non-logged-in users
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, default: '' },
  service: { type: String, required: true },
  budget: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, contacted, quoted, converted, rejected
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);












