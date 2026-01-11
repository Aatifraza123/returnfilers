const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
  subscribe,
  getSubscribers,
  deleteSubscriber,
  unsubscribe
} = require('../controllers/newsletterController');

// Public routes
router.post('/subscribe', subscribe);
router.get('/unsubscribe/:email', unsubscribe); // Public unsubscribe link

// Admin routes - protected
router.get('/', protectAdmin, getSubscribers);
router.delete('/:id', protectAdmin, deleteSubscriber);

module.exports = router;









