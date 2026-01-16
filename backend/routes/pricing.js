const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', pricingController.getAllPricing);
router.get('/category/:category', pricingController.getPricingByCategory);

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', protect, pricingController.getAllPricingAdmin);
router.post('/', protect, pricingController.createPricing);
router.put('/:id', protect, pricingController.updatePricing);
router.delete('/:id', protect, pricingController.deletePricing);

// Dynamic ID route (must be last)
router.get('/:id', pricingController.getPricingById);

module.exports = router;
