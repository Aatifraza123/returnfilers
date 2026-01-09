import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, FaFileInvoice, FaCalendarCheck, FaComments, 
  FaSignOutAlt, FaCog, FaChartLine, FaEnvelope, FaPhone,
  FaArrowRight, FaClock, FaCheckCircle, FaBell, FaStar,
  FaRocket, FaHeadset, FaTrophy, FaFire, FaGift
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import AuthContext from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import NotificationBell from '../../components/common/NotificationBell';

const UserDashboard = () => {
  const { user, logout, token } = useContext(UserAuthContext);
  const { user: adminUser } = useContext(AuthContext);
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    bookings: 0,
    quotes: 0,
    consultations: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Get brand colors from settings or use defaults
  const primaryColor = settings?.brandColors?.primary || '#0B1530';
  const secondaryColor = settings?.brandColors?.secondary || '#C9A227';

  // Convert hex to RGB for dynamic styling
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 11, g: 21, b: 48 }; // default navy blue
  };

  const primaryRgb = hexToRgb(primaryColor);
  const primaryColorStyle = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const primaryColorLight = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`;
  const primaryColorMedium = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`;
  const primaryColorDark = `rgba(${Math.max(0, primaryRgb.r - 20)}, ${Math.max(0, primaryRgb.g - 20)}, ${Math.max(0, primaryRgb.b - 20)}, 1)`;
  
  const secondaryRgb = hexToRgb(secondaryColor);
  const secondaryColorStyle = `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`;

  useEffect(() => {
    if (adminUser && !user) {
      navigate('/admin/dashboard');
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserStats();
  }, [user, adminUser, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data } = await api.get('/user/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setStats({
          bookings: data.user.bookings?.length || 0,
          quotes: data.user.quotes?.length || 0,
          consultations: data.user.consultations?.length || 0
        });

        // Get recent activity
        const allActivity = [
          ...(data.user.bookings || []).map(b => ({ type: 'booking', date: b.createdAt })),
          ...(data.user.quotes || []).map(q => ({ type: 'quote', date: q.createdAt })),
          ...(data.user.consultations || []).map(c => ({ type: 'consultation', date: c.createdAt }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        setRecentActivity(allActivity);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  // Calculate profile completion
  const profileFields = [user?.name, user?.email, user?.phone];
  const completedFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  const accountCards = [
    { 
      title: 'My Bookings',
      value: stats.bookings,
      icon: <FaCalendarCheck className="text-xl" />,
      link: '/dashboard/bookings',
      description: 'Active services'
    },
    { 
      title: 'Quote Requests',
      value: stats.quotes,
      icon: <FaFileInvoice className="text-xl" />,
      link: '/dashboard/quotes',
      description: 'Pending quotes'
    },
    { 
      title: 'Consultations',
      value: stats.consultations,
      icon: <FaComments className="text-xl" />,
      link: '/dashboard/consultations',
      description: 'Scheduled calls'
    }
  ];

  const quickActions = [
    { title: 'Browse Services', link: '/services', icon: <FaChartLine /> },
    { title: 'Book Service', link: '/booking', icon: <FaCalendarCheck /> },
    { title: 'Get Quote', link: '/quote', icon: <FaFileInvoice /> },
    { title: 'Contact Support', link: '/contact', icon: <FaHeadset /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Glassmorphic Top Navigation */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                ReturnFilers
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <NotificationBell type="user" />
              
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors"
                title="Logout"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        {/* Personalized Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-white/90 text-sm">
                      {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30">
                  <FaClock />
                  <span className="font-mono font-semibold">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Completion Bar */}
        {profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white">
                    <FaRocket />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                    <p className="text-sm text-gray-500">Get the most out of your account</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">{profileCompletion}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Account Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {accountCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link
                to={card.link}
                className="block group"
              >
                <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center ${card.textColor} group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                      <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                    <p className="text-xs text-gray-500">{card.description}</p>
                    
                    <div className="mt-4">
                      <div className={`h-1.5 w-full bg-gradient-to-r ${card.gradient} rounded-full`}></div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaRocket className="text-blue-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    to={action.link}
                    className="group p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 border border-gray-200/50 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform shadow-lg"
                      style={{ 
                        background: `linear-gradient(to bottom right, ${primaryColorStyle}, ${primaryColorDark})`
                      }}
                    >
                      {action.icon}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{action.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Usage Analytics Chart */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                Your Activity
              </h2>
              
              <div className="relative h-48 bg-gray-50 rounded-xl p-4">
                <div className="absolute inset-4 flex items-end justify-between gap-3">
                  {[
                    { value: stats.bookings, label: 'Bookings' },
                    { value: stats.quotes, label: 'Quotes' },
                    { value: stats.consultations, label: 'Consultations' }
                  ].map((item, i) => {
                    const maxValue = Math.max(stats.bookings || 1, stats.quotes || 1, stats.consultations || 1);
                    const percentage = item.value > 0 ? Math.round((item.value / maxValue) * 100) : 20;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          className="w-full rounded-t-xl relative group cursor-pointer transition-all"
                          style={{
                            background: `linear-gradient(to top, ${primaryColorStyle}, ${primaryColorMedium})`,
                            minHeight: '20px'
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                            {item.value}
                          </div>
                        </motion.div>
                        <span className="text-xs text-gray-600 font-medium text-center">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaClock className="text-blue-600" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'quote' ? 'bg-blue-100 text-blue-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.type === 'booking' ? <FaCalendarCheck size={14} /> :
                         activity.type === 'quote' ? <FaFileInvoice size={14} /> :
                         <FaComments size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 capitalize">{activity.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaClock className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Account Info
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FaEnvelope size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 text-sm truncate">{user?.email}</p>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FaPhone size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FaClock size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <Link
                to="/dashboard/profile"
                className="mt-6 w-full block text-center px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Edit Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
