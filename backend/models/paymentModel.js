const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, unique: true, sparse: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['pending', 'captured', 'failed', 'refunded'],
    default: 'pending' 
  },
  serviceId: { type: String },
  serviceName: { type: String },
  serviceDescription: { type: String },
  serviceCategory: { type: String },
  servicePrice: { type: Number },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentMethod: { type: String, default: 'razorpay' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

