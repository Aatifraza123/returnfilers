import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaCalendarCheck, 
  FaFileInvoice, 
  FaComments, 
  FaEnvelope,
  FaUser,
  FaCheckDouble
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  getAdminNotifications,
  getUserNotifications,
  getAdminUnreadCount,
  getUserUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../../api/notificationApi';
import toast from 'react-hot-toast';

const NotificationBell = ({ type = 'admin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [type]);

  // Refresh unread count when dropdown opens
  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchUnreadCount();
      fetchNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = type === 'admin' 
        ? await getAdminNotifications(20, false)
        : await getUserNotifications(20, false);
      
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = type === 'admin' 
        ? await getAdminUnreadCount()
        : await getUserUnreadCount();
      
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = type === 'admin' 
        ? localStorage.getItem('token')
        : localStorage.getItem('userToken');
      
      await markAllNotificationsAsRead(type, token);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (notifType) => {
    const iconMap = {
      booking: <FaCalendarCheck className="text-blue-600" />,
      quote: <FaFileInvoice className="text-green-600" />,
      consultation: <FaComments className="text-purple-600" />,
      contact: <FaEnvelope className="text-orange-600" />,
      user: <FaUser className="text-indigo-600" />,
      system: <FaBell className="text-gray-600" />
    };
    return iconMap[notifType] || <FaBell className="text-gray-600" />;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          handleOpen();
        }}
        className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <FaBell className="text-gray-600 text-lg" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FaBell className="text-blue-600" />
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <FaCheckDouble size={12} />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2">
                            {notification.link && (
                              <Link
                                to={notification.link}
                                onClick={() => {
                                  handleMarkAsRead(notification._id);
                                  setIsOpen(false);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                              >
                                View →
                              </Link>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              >
                                <FaCheck size={10} />
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTrash size={10} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                <Link
                  to={type === 'admin' ? '/admin/notifications' : '/dashboard/notifications'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
