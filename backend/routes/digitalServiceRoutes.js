const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDigitalServices,
  getDigitalServiceById,
  createDigitalService,
  updateDigitalService,
  deleteDigitalService
} = require('../controllers/digitalServiceController');

// Public routes
router.get('/', getDigitalServices);
router.get('/:id', getDigitalServiceById);

// Admin routes
router.post('/', protect, admin, createDigitalService);
router.put('/:id', protect, admin, updateDigitalService);
router.delete('/:id', protect, admin, deleteDigitalService);

module.exports = router;
