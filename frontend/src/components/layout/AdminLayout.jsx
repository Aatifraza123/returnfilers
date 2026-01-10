import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
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
  FaClock,
  FaFolderOpen,
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCog
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Fetch notifications (pending items)
  const fetchNotifications = async () => {
    try {
      const [contactsRes, consultationsRes, quotesRes, bookingsRes] = await Promise.all([
        api.get('/contacts').catch(() => ({ data: { contacts: [] } })),
        api.get('/consultations').catch(() => ({ data: { consultations: [] } })),
        api.get('/quotes').catch(() => ({ data: [] })),
        api.get('/bookings').catch(() => ({ data: { bookings: [] } }))
      ]);

      const contacts = contactsRes.data?.contacts || contactsRes.data?.data || [];
      const consultations = consultationsRes.data?.consultations || consultationsRes.data?.data || [];
      const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : (quotesRes.data?.quotes || []);
      const bookings = bookingsRes.data?.bookings || [];

      // Get only PENDING notifications from all types
      const pendingNotifications = [
        ...contacts
          .filter(c => c.status === 'pending')
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
          .filter(c => c.status === 'pending')
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
          .filter(q => q.status === 'pending')
          .map(q => ({
            id: q._id,
            type: 'quote',
            title: 'New Quote Request',
            message: `${q.name} - ${q.service}`,
            time: q.createdAt,
            icon: <FaFileInvoiceDollar className="text-purple-500" />,
            link: '/admin/quotes'
          })),
        ...bookings
          .filter(b => b.status === 'pending')
          .map(b => ({
            id: b._id,
            type: 'booking',
            title: 'New Booking',
            message: `${b.name} - ${b.service}`,
            time: b.createdAt,
            icon: <FaCalendarCheck className="text-teal-500" />,
            link: '/admin/bookings'
          }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time));

      setNotifications(pendingNotifications);
      setUnreadCount(pendingNotifications.length);
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

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { path: '/admin/dashboard', icon: <FaChartPie />, label: 'Dashboard', badge: null },
      ]
    },
    {
      title: 'Communications',
      items: [
        { path: '/admin/emails', icon: <FaInbox />, label: 'Emails', badge: null },
        { path: '/admin/contacts', icon: <FaAddressBook />, label: 'Contacts', badge: null },
      ]
    },
    {
      title: 'Client Requests',
      items: [
        { path: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Bookings', badge: null },
        { path: '/admin/consultations', icon: <FaComments />, label: 'Consultations', badge: null },
        { path: '/admin/quotes', icon: <FaFileInvoiceDollar />, label: 'Quotes', badge: null },
      ]
    },
    {
      title: 'Services & Content',
      items: [
        { path: '/admin/services', icon: <FaServicestack />, label: 'Services', badge: null },
        { path: '/admin/digital-services', icon: <FaFolderOpen />, label: 'Digital Services', badge: null },
        { path: '/admin/blogs', icon: <FaBlog />, label: 'Blogs', badge: null },
        { path: '/admin/testimonials', icon: <FaQuoteRight />, label: 'Testimonials', badge: null },
      ]
    },
    {
      title: 'Settings',
      items: [
        { path: '/admin/profile', icon: <FaUser />, label: 'Profile', badge: null },
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings', badge: null },
      ]
    }
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
        ${sidebarCollapsed ? 'w-16' : 'w-56'} bg-gradient-to-b from-[#0B1530] to-[#1a2b5e] text-white
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl flex flex-col h-screen
      `}>
        {/* Sidebar Header */}
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-b border-white/10 bg-gradient-to-r from-[#0B1530] to-[#1a2b5e] flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'gap-2'}`}>
              {settings?.logo ? (
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'} object-contain`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'} rounded-lg bg-[#C9A227] flex items-center justify-center`}
                style={{ display: settings?.logo ? 'none' : 'flex' }}
              >
                <span className="text-[#0B1530] font-black text-lg">{settings?.logoText || 'RF'}</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-base font-bold text-[#C9A227]">Admin Panel</h2>
                  <p className="text-xs text-gray-400">{settings?.companyName || 'ReturnFilers'}</p>
                </div>
              )}
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
        <nav className="flex-1 overflow-y-auto px-2 py-2 mt-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9A227 transparent' }}>
          <div className="space-y-6">
            {menuSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                {/* Section Title */}
                {!sidebarCollapsed && (
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        title={sidebarCollapsed ? item.label : ''}
                        className={`
                          flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm
                          transition-all duration-200 group relative
                          ${active 
                            ? 'bg-[#C9A227] text-[#0B1530] font-semibold shadow-lg shadow-[#C9A227]/20' 
                            : 'hover:bg-white/10 text-gray-300 hover:text-white hover:translate-x-1'
                          }
                        `}
                      >
                        <span className={`text-lg flex-shrink-0 ${active ? 'text-[#0B1530]' : 'text-gray-400 group-hover:text-[#C9A227] transition-colors'}`}>
                          {item.icon}
                        </span>
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                {item.badge}
                              </span>
                            )}
                            {active && (
                              <span className="absolute right-2 w-1.5 h-1.5 bg-[#0B1530] rounded-full"></span>
                            )}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse Toggle Button (Desktop Only) */}
        <div className="hidden lg:block px-2 py-2 border-t border-white/10">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 w-full rounded-lg hover:bg-white/10 text-gray-300 hover:text-[#C9A227] transition-all group text-sm font-medium`}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <FaChevronRight className="text-base group-hover:scale-110 transition-transform" />
            ) : (
              <>
                <FaChevronLeft className="text-base group-hover:scale-110 transition-transform" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/10 bg-white/5 flex-shrink-0">
          <button 
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : ''}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 w-full rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all group text-sm font-medium`}
          >
            <FaSignOutAlt className="text-base group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span>Logout</span>}
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
              
              {/* Breadcrumb / Page Title */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Admin</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-[#0B1530] font-semibold">
                    {menuSections.flatMap(s => s.items).find(item => isActive(item.path))?.label || 'Dashboard'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Admin Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B1530] to-[#1a2b5e] flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-[#0B1530] leading-tight">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        Administrator
                      </p>
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      {/* Profile Header */}
                      <div className="p-4 bg-gradient-to-r from-[#0B1530] to-[#1a2b5e] text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-white/70">{user?.email || 'razaaatif658@gmail.com'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/admin/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#0B1530]"
                        >
                          <FaUser className="text-gray-400" />
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        <Link
                          to="/admin/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#0B1530]"
                        >
                          <FaCog className="text-gray-400" />
                          <span className="text-sm font-medium">Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 w-full"
                        >
                          <FaSignOutAlt className="text-red-500" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9A227 #f3f4f6' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
