const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controller functions with error handling
let createOrder, verifyPayment, getPayments, getPaymentById;
try {
  const paymentController = require('../controllers/paymentController');
  createOrder = paymentController.createOrder;
  verifyPayment = paymentController.verifyPayment;
  getPayments = paymentController.getPayments;
  getPaymentById = paymentController.getPaymentById;
  console.log('✓ Payment controller functions loaded');
} catch (error) {
  console.error('✗ Error loading payment controller:', error);
}

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes are working!', timestamp: new Date().toISOString() });
});

// @route   POST /api/payments/create-order (Public - for creating Razorpay order)
router.post('/create-order', (req, res, next) => {
  console.log('POST /api/payments/create-order - Route hit');
  if (!createOrder) {
    return res.status(500).json({ message: 'Payment controller not loaded' });
  }
  createOrder(req, res, next);
});

// @route   POST /api/payments/verify (Public - for verifying payment)
router.post('/verify', (req, res, next) => {
  console.log('POST /api/payments/verify - Route hit');
  if (!verifyPayment) {
    return res.status(500).json({ message: 'Payment controller not loaded' });
  }
  verifyPayment(req, res, next);
});

// @route   GET /api/payments (Protected - Admin only)
router.get('/', protect, (req, res, next) => {
  if (!getPayments) {
    return res.status(500).json({ message: 'Payment controller not loaded' });
  }
  getPayments(req, res, next);
});

// @route   GET /api/payments/:id (Protected - Admin only)
router.get('/:id', protect, (req, res, next) => {
  if (!getPaymentById) {
    return res.status(500).json({ message: 'Payment controller not loaded' });
  }
  getPaymentById(req, res, next);
});

module.exports = router;
