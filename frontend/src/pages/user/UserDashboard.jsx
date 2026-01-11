import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaFileInvoice, FaCalendarCheck, FaComments, 
  FaSignOutAlt, FaCog, FaEnvelope, FaPhone, FaHome
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
  const [stats, setStats] = useState({
    bookings: 0,
    quotes: 0,
    consultations: 0
  });
  const [loading, setLoading] = useState(true);

  // Get brand colors from settings or use defaults
  const primaryColor = settings?.brandColors?.primary || '#0B1530';
  const secondaryColor = settings?.brandColors?.secondary || '#C9A227';

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

  if (loading) return <Loader />;

  const quickLinks = [
    { title: 'My Profile', icon: <FaUser />, link: '/dashboard/profile', desc: 'View and edit your profile' },
    { title: 'My Bookings', icon: <FaCalendarCheck />, link: '/dashboard/bookings', desc: 'View your service bookings', count: stats.bookings },
    { title: 'My Quotes', icon: <FaFileInvoice />, link: '/dashboard/quotes', desc: 'View quote requests', count: stats.quotes },
    { title: 'Consultations', icon: <FaComments />, link: '/dashboard/consultations', desc: 'View consultation requests', count: stats.consultations },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FaHome size={20} style={{ color: primaryColor }} />
              <span className="font-bold text-lg" style={{ color: primaryColor }}>ReturnFilers</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <NotificationBell type="user" />
              
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <FaSignOutAlt size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings, quotes, and consultations from your dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.bookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaCalendarCheck className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Quote Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaFileInvoice className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Consultations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.consultations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaComments className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.link}
                className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                style={{ 
                  '--hover-border-color': primaryColor 
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-colors"
                    style={{
                      '--hover-bg': primaryColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#4b5563';
                    }}
                  >
                    {link.icon}
                  </div>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="px-2 py-1 text-white text-xs font-bold rounded" style={{ backgroundColor: secondaryColor }}>
                      {link.count}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="rounded-lg p-6 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-gray-300 text-sm">Our support team is here to assist you</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:info@returnfilers.in"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg font-medium hover:bg-gray-100 transition-colors"
                style={{ color: primaryColor }}
              >
                <FaEnvelope />
                Email Us
              </a>
              <a
                href="tel:+918447127264"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: secondaryColor, color: primaryColor }}
              >
                <FaPhone />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
