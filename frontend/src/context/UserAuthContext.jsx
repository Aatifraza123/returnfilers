import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('userToken'));

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/user/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('userToken', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userToken');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserAuthContext.Provider value={{ user, token, loading, login, logout, updateUser, fetchUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
