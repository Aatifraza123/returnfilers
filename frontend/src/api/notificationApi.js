import api from './axios';

// Admin Notifications
export const getAdminNotifications = async (limit = 50, unreadOnly = false) => {
  const token = localStorage.getItem('token');
  const response = await api.get('/notifications/admin', {
    params: { limit, unreadOnly },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAdminUnreadCount = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/notifications/admin/unread-count', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// User Notifications
export const getUserNotifications = async (limit = 50, unreadOnly = false) => {
  const token = localStorage.getItem('userToken');
  const response = await api.get('/notifications/user', {
    params: { limit, unreadOnly },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getUserUnreadCount = async () => {
  const token = localStorage.getItem('userToken');
  const response = await api.get('/notifications/user/unread-count', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Common Actions
export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (recipient, token) => {
  const response = await api.put('/notifications/mark-all-read', 
    { recipient },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};
