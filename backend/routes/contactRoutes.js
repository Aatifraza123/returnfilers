const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  sendBulkEmail
} = require('../controllers/contactController');

// Public route - anyone can submit
router.post('/', createContact);

// Admin routes - protected
router.get('/', protect, getContacts);
router.get('/:id', protect, getContactById);
router.patch('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

// Bulk email route - admin only
router.post('/bulk-email', protect, sendBulkEmail);

module.exports = router;




