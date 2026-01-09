import api from './axios';

// Admin login
export const login = async (credentials) => {
  const response = await api.post('/admin/auth/login', credentials);
  return response.data;
};

// Admin register (if needed)
export const register = async (userData) => {
  const response = await api.post('/admin/auth/register', userData);
  return response.data;
};
