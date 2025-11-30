const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: String, required: true },
  description: { type: String, required: true },
  outcome: { type: String },
  images: [String],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
