const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  subscribe,
  getSubscribers,
  deleteSubscriber
} = require('../controllers/newsletterController');

// Public route - anyone can subscribe
router.post('/subscribe', subscribe);

// Admin routes - protected
router.get('/', protect, getSubscribers);
router.delete('/:id', protect, deleteSubscriber);

module.exports = router;








