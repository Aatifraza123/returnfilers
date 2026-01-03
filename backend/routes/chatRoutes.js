const express = require('express');
const router = express.Router();
const { chatWithAI, testAI } = require('../controllers/chatController');

// Public route - no auth required
router.post('/', chatWithAI);

// Test endpoint to check if AI APIs are working
router.get('/test', testAI);

module.exports = router;
