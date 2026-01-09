import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, FaFileInvoice, FaCalendarCheck, FaComments, 
  FaSignOutAlt, FaCog, FaChartLine, FaEnvelope, FaPhone 
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const UserDashboard = () => {
  const { user, logout, token } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bookings: 0,
    quotes: 0,
    consultations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserStats();
  }, [user, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const statCards = [
    { icon: <FaCalendarCheck />, label: 'Bookings', value: stats.bookings, color: 'bg-blue-500', link: '/dashboard/bookings' },
    { icon: <FaFileInvoice />, label: 'Quotes', value: stats.quotes, color: 'bg-green-500', link: '/dashboard/quotes' },
    { icon: <FaComments />, label: 'Consultations', value: stats.consultations, color: 'bg-purple-500', link: '/dashboard/consultations' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0B1530] text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-300 text-sm">Manage your services and track your requests</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard/profile"
                className="px-4 py-2 bg-[#C9A227] text-[#0B1530] rounded-lg font-semibold hover:bg-white transition-colors flex items-center gap-2"
              >
                <FaCog /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#0B1530] transition-colors flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#0B1530]">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#0B1530] mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/services"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all text-center"
            >
              <FaChartLine className="text-3xl text-[#C9A227] mx-auto mb-2" />
              <p className="font-semibold text-[#0B1530]">Browse Services</p>
            </Link>
            <Link
              to="/booking"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all text-center"
            >
              <FaCalendarCheck className="text-3xl text-[#C9A227] mx-auto mb-2" />
              <p className="font-semibold text-[#0B1530]">Book Service</p>
            </Link>
            <Link
              to="/quote"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all text-center"
            >
              <FaFileInvoice className="text-3xl text-[#C9A227] mx-auto mb-2" />
              <p className="font-semibold text-[#0B1530]">Get Quote</p>
            </Link>
            <Link
              to="/contact"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all text-center"
            >
              <FaComments className="text-3xl text-[#C9A227] mx-auto mb-2" />
              <p className="font-semibold text-[#0B1530]">Contact Us</p>
            </Link>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#0B1530] mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <FaUser className="text-[#C9A227]" />
              <span className="font-semibold">Name:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FaEnvelope className="text-[#C9A227]" />
              <span className="font-semibold">Email:</span>
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <FaPhone className="text-[#C9A227]" />
                <span className="font-semibold">Phone:</span>
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-600">
              <span className="font-semibold">Member Since:</span>
              <span>{new Date(user?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
          <Link
            to="/dashboard/profile"
            className="mt-4 inline-block text-[#C9A227] hover:text-[#0B1530] font-semibold"
          >
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
