const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find user first, then admin
      let user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        // If not a regular user, check if it's an admin
        user = await Admin.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('Auth error:', error.message);
      res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  // Check if user is admin (either from Admin model or User model with isAdmin flag)
  if (req.user && (req.user.isAdmin === true || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin', user: req.user?.email, isAdmin: req.user?.isAdmin });
  }
};

module.exports = { protect, admin };

