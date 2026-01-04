import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaChartPie, 
  FaServicestack, 
  FaBlog, 
  FaEnvelope, 
  FaSignOutAlt, 
  FaBriefcase, 
  FaComments,
  FaUser,
  FaBars,
  FaTimes,
  FaBell,
  FaInbox,
  FaAddressBook,
  FaFileInvoiceDollar,
  FaQuoteRight,
  FaPhone,
  FaClock
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications (pending items)
  const fetchNotifications = async () => {
    try {
      const [contactsRes, consultationsRes, quotesRes] = await Promise.all([
        api.get('/contacts').catch(() => ({ data: { contacts: [] } })),
        api.get('/consultations').catch(() => ({ data: { consultations: [] } })),
        api.get('/quotes').catch(() => ({ data: [] }))
      ]);

      const contacts = contactsRes.data?.contacts || contactsRes.data?.data || [];
      const consultations = consultationsRes.data?.consultations || consultationsRes.data?.data || [];
      const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : (quotesRes.data?.quotes || []);

      // Get pending items from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentNotifications = [
        ...contacts
          .filter(c => c.status === 'pending' && new Date(c.createdAt) > sevenDaysAgo)
          .map(c => ({
            id: c._id,
            type: 'contact',
            title: 'New Contact',
            message: `${c.name} sent a message`,
            time: c.createdAt,
            icon: <FaEnvelope className="text-green-500" />,
            link: '/admin/contacts'
          })),
        ...consultations
          .filter(c => c.status === 'pending' && new Date(c.createdAt) > sevenDaysAgo)
          .map(c => ({
            id: c._id,
            type: 'consultation',
            title: 'New Consultation',
            message: `${c.name} - ${c.service}`,
            time: c.createdAt,
            icon: <FaPhone className="text-blue-500" />,
            link: '/admin/consultations'
          })),
        ...quotes
          .filter(q => q.status === 'pending' && new Date(q.createdAt) > sevenDaysAgo)
          .map(q => ({
            id: q._id,
            type: 'quote',
            title: 'New Quote Request',
            message: `${q.name} - ${q.service}`,
            time: q.createdAt,
            icon: <FaFileInvoiceDollar className="text-purple-500" />,
            link: '/admin/quotes'
          }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

      setNotifications(recentNotifications);
      setUnreadCount(recentNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false);
    navigate(notification.link);
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartPie />, label: 'Dashboard', badge: null },
    { path: '/admin/emails', icon: <FaInbox />, label: 'Emails', badge: null },
    { path: '/admin/consultations', icon: <FaComments />, label: 'Consultations', badge: null },
    { path: '/admin/contacts', icon: <FaAddressBook />, label: 'Contacts', badge: null },
    { path: '/admin/quotes', icon: <FaFileInvoiceDollar />, label: 'Quotes', badge: null },
    { path: '/admin/services', icon: <FaServicestack />, label: 'Services', badge: null },
    { path: '/admin/portfolio', icon: <FaBriefcase />, label: 'Portfolio', badge: null },
    { path: '/admin/blogs', icon: <FaBlog />, label: 'Blogs', badge: null },
    { path: '/admin/testimonials', icon: <FaQuoteRight />, label: 'Testimonials', badge: null },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-56 bg-gradient-to-b from-[#0B1530] to-[#1a2b5e] text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl flex flex-col h-screen
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#0B1530] to-[#1a2b5e] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <FaChartPie className="text-[#0B1530] text-lg" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#D4AF37]">Admin Panel</h2>
                <p className="text-xs text-gray-400">Tax Filer</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 mt-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4AF37 transparent' }}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                    transition-all duration-200 group relative
                    ${active 
                      ? 'bg-[#D4AF37] text-[#0B1530] font-semibold shadow-lg shadow-[#D4AF37]/20' 
                      : 'hover:bg-white/10 text-gray-300 hover:text-white hover:translate-x-1'
                    }
                  `}
                >
                  <span className={`text-lg flex-shrink-0 ${active ? 'text-[#0B1530]' : 'text-gray-400 group-hover:text-[#D4AF37] transition-colors'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute right-2 w-1.5 h-1.5 bg-[#0B1530] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/10 bg-white/5 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all group text-sm font-medium"
          >
            <FaSignOutAlt className="text-base group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 flex-shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-[#0B1530] p-1.5"
              >
                <FaBars className="text-lg" />
              </button>
              <h1 className="text-lg font-bold text-[#0B1530]">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 text-gray-600 hover:text-[#0B1530] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaBell className="text-base" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-3 bg-[#0B1530] text-white flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-[#D4AF37] text-[#0B1530] px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  {notification.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#0B1530]">{notification.title}</p>
                                  <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <FaClock className="text-[10px]" />
                                    {formatTimeAgo(notification.time)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-gray-500">
                            <FaBell className="text-3xl mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No new notifications</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-2 bg-gray-50 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              navigate('/admin/emails');
                            }}
                            className="w-full text-center text-xs text-[#0B1530] hover:text-[#D4AF37] font-medium py-1"
                          >
                            View All Emails
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0B1530] font-bold text-sm">
                  A
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-semibold text-[#0B1530]">Admin</p>
                  <p className="text-xs text-gray-500">admin@ca.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4AF37 #f3f4f6' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
