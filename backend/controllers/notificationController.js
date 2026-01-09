const Notification = require('../models/notificationModel');

// Create notification (helper function)
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Get all notifications for admin
exports.getAdminNotifications = async (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    
    const query = { recipient: 'admin' };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({ 
      recipient: 'admin', 
      isRead: false 
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// Get notifications for specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    const userId = req.user._id;
    
    const query = { 
      recipient: 'user',
      recipientId: userId
    };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({ 
      recipient: 'user',
      recipientId: userId,
      isRead: false 
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { recipient } = req.body;
    const userId = req.user?._id;

    const query = { recipient };
    if (recipient === 'user' && userId) {
      query.recipientId = userId;
    }

    await Notification.updateMany(
      query,
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications'
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
};

// Get unread count for admin
exports.getAdminUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: 'admin', 
      isRead: false 
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting admin unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting count'
    });
  }
};

// Get unread count for user
exports.getUserUnreadCount = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const count = await Notification.countDocuments({ 
      recipient: 'user',
      recipientId: userId,
      isRead: false 
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting user unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting count'
    });
  }
};
