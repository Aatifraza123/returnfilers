import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowRight, FaPhone } from 'react-icons/fa';
import api from '../api/axios';
import UserAuthContext from '../context/UserAuthContext';

const Login = () => {
  const navigate = useNavigate();
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
        // Login
        const { data } = await api.post('/user/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (data.success) {
          login(data.user, data.token);
          toast.success(`Welcome back, ${data.user.name}!`);
          navigate('/dashboard');
        }
      } else {
        // Register
        const { data } = await api.post('/user/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        
        if (data.success) {
          login(data.user, data.token);
          toast.success('Account created successfully!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#0B1530] rounded-b-[50px] z-0"></div>
      <div className="absolute top-10 right-10 w-24 h-24 bg-[#C9A227] rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#0B1530] rounded-full opacity-10 blur-xl"></div>

      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 text-center">
          <motion.h2 
            key={isLogin ? "login-h" : "signup-h"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif font-bold text-[#0B1530] mb-2"
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </motion.h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Enter your details to access your account' : 'Start your financial journey with us today'}
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <AnimatePresence mode='wait'>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-5"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required={!isLogin}
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] transition-all text-sm"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] transition-all text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] transition-all text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#0B1530] transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="flex justify-end">
                <Link to="/forgot-password" class="text-xs font-semibold text-[#0B1530] hover:text-[#C9A227] transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1530] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#1a2b5e] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'} <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Sign in with Google
          </button>

          {/* Toggle Mode Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-[#0B1530] hover:text-[#C9A227] transition-colors underline decoration-transparent hover:decoration-[#C9A227]"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
