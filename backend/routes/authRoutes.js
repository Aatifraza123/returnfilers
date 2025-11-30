const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Ensure this file exists
const User = require('../models/userModel'); 

// Login & Register
router.post('/login', loginUser);
router.post('/register', registerUser);

// Get Current User (Required for Dashboard)
router.get('/me', protect, getMe); 

// --- TEMPORARY RESET ROUTE ---
router.get('/delete-admin', async (req, res) => {
  try {
    await User.deleteOne({ email: "admin@ca.com" });
    res.send("Admin user deleted! Now go register again.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;


