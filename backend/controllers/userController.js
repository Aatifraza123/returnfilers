const User = require('../models/userModel');
const Booking = require('../models/Booking');
const Quote = require('../models/quoteModel');
const Consultation = require('../models/Consultation');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken -verificationTokenExpire -emailOTP -emailOTPExpire')
      .sort({ createdAt: -1 })
      .lean();

    // Get counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const [bookingsCount, quotesCount, consultationsCount] = await Promise.all([
          Booking.countDocuments({ user: user._id }),
          Quote.countDocuments({ user: user._id }),
          Consultation.countDocuments({ user: user._id })
        ]);

        return {
          ...user,
          bookingsCount,
          quotesCount,
          consultationsCount,
          totalActivity: bookingsCount + quotesCount + consultationsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users: usersWithCounts
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken -verificationTokenExpire -emailOTP -emailOTPExpire')
      .populate('bookings')
      .populate('quotes')
      .populate('consultations');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Admin
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
    const unverifiedUsers = totalUsers - verifiedUsers;
    
    // Users registered in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        newUsers
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message
    });
  }
};
