import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBell,
  FaArrowLeft,
  FaTrash,
  FaCheck,
  FaCheckDouble,
  FaCalendarCheck,
  FaFileInvoice,
  FaComments,
  FaEnvelope,
  FaUser,
  FaClock,
  FaFilter
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../../api/notificationApi';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const UserNotifications = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(UserAuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(100, false);
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(
        notifications.map(n =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead('user', token);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
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

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <FaBell className="text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaCheckDouble size={14} />
                Mark all as read
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter Tabs */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex gap-2"
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              <FaBell size={14} />
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              <FaFilter size={14} />
              Unread ({notifications.filter(n => !n.isRead).length})
            </button>
          </motion.div>
        )}

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FaBell className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold mb-2">No notifications</p>
              <p className="text-sm text-gray-500">
                {filter === 'all'
                  ? "You're all caught up!"
                  : 'No notifications in this category'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm border transition-all p-4 ${
                    !notification.isRead
                      ? 'border-blue-200 bg-blue-50/30'
                      : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <FaClock size={12} />
                        {getTimeAgo(notification.createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.link && (
                          <Link
                            to={notification.link}
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-semibold text-xs hover:bg-blue-200 transition-colors"
                          >
                            View Details →
                          </Link>
                        )}
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <FaCheck size={10} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <FaTrash size={10} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserNotifications;
