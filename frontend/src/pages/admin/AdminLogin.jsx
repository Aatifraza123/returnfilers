import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { login as apiLogin } from '../../api/authApi'; 
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { settings } = useSettings();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      
      if (data && data.token) {
        login(data, data.token);
        toast.success('Login Successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid Credentials';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-5xl mx-auto relative">
        {/* Back to Home Button - Above Box */}
        <Link 
          to="/" 
          className="absolute -top-16 left-0 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Dark Background */}
            <div className="hidden lg:block lg:w-2/5 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 overflow-hidden">
              {/* Geometric Shapes Background */}
              <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white/10 rounded-lg transform rotate-12"></div>
              <div className="absolute top-20 right-20 w-48 h-48 border-2 border-white/10 rounded-lg transform -rotate-6"></div>
              <div className="absolute bottom-20 left-10 w-32 h-32 border-2 border-white/10 rounded-lg transform rotate-45"></div>

              <div className="relative h-full flex flex-col justify-center z-10">
                {/* Icon */}
                <div className="mb-8">
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.5 8.5H20L15 12.5L17 19L12 15L7 19L9 12.5L4 8.5H10.5L12 2Z" />
                  </svg>
                </div>

                {/* Main Heading */}
                <div className="mb-12">
                  <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Admin<br />Portal
                  </h1>
                  <p className="text-white/90 text-lg leading-relaxed max-w-md">
                    Manage your platform with powerful tools and comprehensive control over all operations.
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
            <div className="w-full lg:w-3/5 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Admin Login
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your credentials to access the admin panel
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
