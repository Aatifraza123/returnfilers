import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, onSuccess, message = 'Please login to continue' }) => {
  const { login } = useContext(UserAuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await api.post('/user/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (data.success) {
          login(data.user, data.token);
          toast.success(`Welcome back, ${data.user.name}!`);
          onSuccess && onSuccess(data.user);
          onClose();
        }
      } else {
        const { data } = await api.post('/user/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        
        if (data.success) {
          login(data.user, data.token);
          toast.success('Account created successfully!');
          onSuccess && onSuccess(data.user);
          onClose();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] text-white">
            <motion.h2
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold mb-2"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h2>
            <p className="text-gray-300 text-sm">{message}</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode='wait'>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required={!isLogin}
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] text-sm"
                      />
                    </div>
                    
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone (Optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] text-sm"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B1530] text-white py-3 rounded-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-bold text-[#0B1530] hover:text-[#C9A227] transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Continue without login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
