import { useState, useContext, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';
import UserAuthContext from '../../context/UserAuthContext';
import GoogleLoginButton from '../auth/GoogleLoginButton';
import OTPVerification from '../auth/OTPVerification';

const AuthModal = ({ isOpen, onClose, onSuccess, message = 'Please login to continue' }) => {
  const navigate = useNavigate();
  const { login } = useContext(UserAuthContext);
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
        // Login
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
        // Register
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
    onSuccess && onSuccess(user);
    onClose();
  };

  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setRegisteredEmail('');
  };

  const handleGoogleSuccess = () => {
    // Toast is already shown in GoogleLoginButton component
    onSuccess && onSuccess();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={20} />
                </button>

                {/* Show OTP Verification or Login Form */}
                {showOTPVerification ? (
                  <div className="p-8">
                    <OTPVerification 
                      email={registeredEmail}
                      onVerified={handleOTPVerified}
                      onBack={handleBackToRegistration}
                    />
                  </div>
                ) : (
                  <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isLogin ? 'Login' : 'Sign Up'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {message}
                    </p>
                  </div>

                  {/* Form */}
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
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate('/forgot-password');
                          }}
                          className="text-xs text-gray-600 hover:text-gray-900"
                        >
                          Forgot Password?
                        </button>
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
                  <GoogleLoginButton onSuccess={handleGoogleSuccess} />

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
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;
