const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
  subscribe,
  getSubscribers,
  deleteSubscriber
} = require('../controllers/newsletterController');

// Public route - anyone can subscribe
router.post('/subscribe', subscribe);

// Admin routes - protected
router.get('/', protectAdmin, getSubscribers);
router.delete('/:id', protectAdmin, deleteSubscriber);

module.exports = router;









