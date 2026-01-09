import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import api from '../api/axios';
import UserAuthContext from '../context/UserAuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          
          // Redirect to the page they came from or dashboard
          const from = location.state?.from || '/dashboard';
          navigate(from);
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
          
          // Redirect to the page they came from or dashboard
          const from = location.state?.from || '/dashboard';
          navigate(from);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google login coming soon!', {
      icon: 'ℹ️',
      duration: 3000
    });
    // TODO: Implement Google OAuth
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Welcome back! Please login to your account' : 'Create a new account to get started'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Signup Fields */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required={!isLogin}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-gray-600 hover:text-gray-900">
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 bg-white text-gray-700 py-2.5 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 font-medium text-gray-900 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
