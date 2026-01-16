const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

// All routes require admin authentication
router.use(protect);
router.use(admin);

// Get user stats (MUST be before /:id route)
router.get('/stats', getUserStats);

// Get all users
router.get('/', getAllUsers);

// Get user by ID (MUST be after /stats route)
router.get('/:id', getUserById);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
