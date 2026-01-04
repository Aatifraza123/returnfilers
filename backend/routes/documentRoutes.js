const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');

// Public route - anyone can submit documents
router.post('/', createDocument);

// Admin routes - protected
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocumentById);
router.patch('/:id', protect, updateDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
