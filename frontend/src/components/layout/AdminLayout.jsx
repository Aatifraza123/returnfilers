import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaChartPie, 
  FaServicestack, 
  FaBlog, 
  FaEnvelope, 
  FaSignOutAlt, 
  FaBriefcase, 
  FaCreditCard,
  FaComments,
  FaUser,
  FaBars,
  FaTimes,
  FaBell,
  FaInbox,
  FaAddressBook,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartPie />, label: 'Dashboard', badge: null },
    { path: '/admin/emails', icon: <FaInbox />, label: 'Emails', badge: null },
    { path: '/admin/consultations', icon: <FaComments />, label: 'Consultations', badge: null },
    { path: '/admin/contacts', icon: <FaAddressBook />, label: 'Contacts', badge: null },
    { path: '/admin/quotes', icon: <FaFileInvoiceDollar />, label: 'Quotes', badge: null },
    { path: '/admin/services', icon: <FaServicestack />, label: 'Services', badge: null },
    { path: '/admin/portfolio', icon: <FaBriefcase />, label: 'Portfolio', badge: null },
    { path: '/admin/blogs', icon: <FaBlog />, label: 'Blogs', badge: null },
    { path: '/admin/payments', icon: <FaCreditCard />, label: 'Payments', badge: null },
  ];

  const handleLogout = () => {
    logout(); // logout already handles navigation
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
                <p className="text-xs text-gray-400">CA Associates</p>
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
              <button className="relative p-1.5 text-gray-600 hover:text-[#0B1530] hover:bg-gray-100 rounded-lg transition-colors">
                <FaBell className="text-base" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
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
