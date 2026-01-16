const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUser } = require('../middleware/userAuth');

// Import controller functions
let createQuote, getQuotes, updateQuote, deleteQuote, getUserQuotes;
try {
  const quoteController = require('../controllers/quoteController');
  createQuote = quoteController.createQuote;
  getQuotes = quoteController.getQuotes;
  updateQuote = quoteController.updateQuote;
  deleteQuote = quoteController.deleteQuote;
  getUserQuotes = quoteController.getUserQuotes;
  console.log('✓ Quote controller functions loaded');
} catch (error) {
  console.error('✗ Error loading quote controller:', error);
}

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Quote routes are working!', timestamp: new Date().toISOString() });
});

// User route - get user's own quotes
router.get('/my-quotes', protectUser, getUserQuotes);

// @route   /api/quotes
router.route('/')
  .post(createQuote)  // Public: Anyone can submit quote request
  .get(protectAdmin, getQuotes);        // Private: Only Admin can view

// @route   /api/quotes/:id
router.route('/:id')
  .patch(protectAdmin, updateQuote)    // Private: Update status
  .delete(protectAdmin, deleteQuote);   // Private: Delete quote

module.exports = router;

