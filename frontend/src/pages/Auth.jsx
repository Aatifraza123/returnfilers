import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api/axios';
import UserAuthContext from '../context/UserAuthContext';
import { useSettings } from '../context/SettingsContext';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import OTPVerification from '../components/auth/OTPVerification';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserAuthContext);
  const { settings } = useSettings();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

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
          const from = location.state?.from || '/dashboard';
          navigate(from);
        }
      } else {
        const { data } = await api.post('/user/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        
        if (data.success) {
          toast.success(data.message);
          setRegisteredEmail(formData.email);
          setShowOTPVerification(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      if (error.response?.data?.requiresVerification) {
        toast.error(error.response.data.message);
        setRegisteredEmail(error.response.data.email);
        setShowOTPVerification(true);
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (user, token) => {
    login(user, token);
    const from = location.state?.from || '/dashboard';
    navigate(from);
  };

  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setRegisteredEmail('');
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <OTPVerification 
          email={registeredEmail}
          onVerified={handleOTPVerified}
          onBack={handleBackToRegistration}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Grey Background with Features */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-16 overflow-hidden">
              {/* Geometric Shapes Background */}
              <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white/20 rounded-lg transform rotate-12"></div>
              <div className="absolute top-20 right-20 w-48 h-48 border-2 border-white/20 rounded-lg transform -rotate-6"></div>
              <div className="absolute bottom-20 left-10 w-32 h-32 border-2 border-white/20 rounded-lg transform rotate-45"></div>

              <div className="relative h-full flex flex-col justify-center z-10">
                {/* Asterisk Icon */}
                <div className="mb-8">
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.5 8.5H20L15 12.5L17 19L12 15L7 19L9 12.5L4 8.5H10.5L12 2Z" />
                  </svg>
                </div>

                {/* Main Heading */}
                <div className="mb-12">
                  <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Hello<br />ReturnFilers!👋
                  </h1>
                  <p className="text-white/90 text-lg leading-relaxed max-w-md">
                    Your trusted partner for seamless tax filing and financial services. Experience professional expertise with hassle-free compliance solutions!
                  </p>
                </div>
                
                {/* Copyright */}
                <div className="mt-auto">
                  <p className="text-white/70 text-sm">
                    © {new Date().getFullYear()} {settings?.companyName || 'ReturnFilers'}. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isLogin ? 'Welcome back! Please login to your account' : 'Create a new account to get started'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                {isLogin && (
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-gray-600 hover:text-gray-900">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <GoogleLoginButton 
                onSuccess={() => {
                  const from = location.state?.from || '/dashboard';
                  navigate(from);
                }}
              />

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
      </div>
    </div>
  );
};

export default Login;
