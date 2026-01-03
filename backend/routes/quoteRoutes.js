const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controller functions
let createQuote, getQuotes, updateQuote, deleteQuote;
try {
  const quoteController = require('../controllers/quoteController');
  createQuote = quoteController.createQuote;
  getQuotes = quoteController.getQuotes;
  updateQuote = quoteController.updateQuote;
  deleteQuote = quoteController.deleteQuote;
  console.log('✓ Quote controller functions loaded');
} catch (error) {
  console.error('✗ Error loading quote controller:', error);
}

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Quote routes are working!', timestamp: new Date().toISOString() });
});

// @route   /api/quotes
router.route('/')
  .post(createQuote)               // Public: Anyone can submit quote
  .get(protect, getQuotes);        // Private: Only Admin can view

// @route   /api/quotes/:id
router.route('/:id')
  .patch(protect, updateQuote)    // Private: Update status
  .delete(protect, deleteQuote);   // Private: Delete quote

module.exports = router;

