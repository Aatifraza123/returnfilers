const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');

// Public Routes
router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);

// Admin Routes (Protected)
router.post('/', protect, admin, createPortfolio);
router.put('/:id', protect, admin, updatePortfolio);
router.delete('/:id', protect, admin, deletePortfolio);

module.exports = router;











