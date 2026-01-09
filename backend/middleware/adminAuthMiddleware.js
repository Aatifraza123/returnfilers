const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from token
    req.user = await Admin.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

module.exports = { protectAdmin };
