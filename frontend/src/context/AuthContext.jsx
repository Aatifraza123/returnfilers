import { createContext, useState, useEffect, useContext } from 'react'; // Added useContext
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

// 1. ADD THIS HOOK EXPORT
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const { data } = await api.get('/auth/me', {
              signal: controller.signal,
              timeout: 3000
            });
            clearTimeout(timeoutId);
            setUser(data);
          } catch (error) {
            // Don't clear token on network errors - might just be backend down
            if (error.response?.status === 401 || error.response?.status === 403) {
              // Only clear on auth errors
              localStorage.removeItem('token');
              localStorage.removeItem('userInfo');
              setUser(null);
            } else {
              // For network errors, try to use cached user info
              const userInfo = localStorage.getItem('userInfo');
              if (userInfo) {
                try {
                  setUser(JSON.parse(userInfo));
                } catch (e) {
                  console.error("Failed to parse userInfo", e);
                }
              }
            }
          }
        } else {
          // If no token, try to get user from localStorage
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            try {
              setUser(JSON.parse(userInfo));
            } catch (e) {
              console.error("Failed to parse userInfo", e);
            }
          }
        }
      } catch (error) {
        console.error("Error in checkUser", error);
      } finally {
        setLoading(false); 
      }
    };

    checkUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    navigate('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;



