import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  FaChartPie, 
  FaServicestack, 
  FaBlog, 
  FaEnvelope, 
  FaSignOutAlt, 
  FaComments,
  FaUser,
  FaBars,
  FaTimes,
  FaInbox,
  FaAddressBook,
  FaFileInvoiceDollar,
  FaQuoteRight,
  FaFolderOpen,
  FaCalendarCheck,
  FaCog,
  FaHome
} from 'react-icons/fa';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartPie />, label: 'Dashboard' },
    { path: '/admin/customers', icon: <FaUser />, label: 'Customers' },
    { path: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Bookings' },
    { path: '/admin/consultations', icon: <FaComments />, label: 'Consultations' },
    { path: '/admin/quotes', icon: <FaFileInvoiceDollar />, label: 'Quotes' },
    { path: '/admin/contacts', icon: <FaAddressBook />, label: 'Contacts' },
    { path: '/admin/services', icon: <FaServicestack />, label: 'Services' },
    { path: '/admin/digital-services', icon: <FaFolderOpen />, label: 'Digital Services' },
    { path: '/admin/pricing', icon: <FaFileInvoiceDollar />, label: 'Pricing' },
    { path: '/admin/blogs', icon: <FaBlog />, label: 'Blogs' },
    { path: '/admin/testimonials', icon: <FaQuoteRight />, label: 'Testimonials' },
    { path: '/admin/emails', icon: <FaInbox />, label: 'Emails' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r border-gray-200
        transform transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarExpanded ? 'w-64' : 'w-20'}
        flex flex-col h-screen
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarExpanded ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{settings?.logoText || 'RF'}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 truncate">Admin Panel</h2>
                    <p className="text-xs text-gray-500 truncate">{settings?.companyName || 'ReturnFilers'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-900 flex-shrink-0"
                >
                  <FaTimes size={20} />
                </button>
              </>
            ) : (
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-lg">{settings?.logoText || 'RF'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={!sidebarExpanded ? item.label : ''}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${active 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${!sidebarExpanded ? 'justify-center' : ''}
                  `}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  {sidebarExpanded && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          {sidebarExpanded ? (
            <>
              <Link
                to="/admin/profile"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 mb-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/admin/profile'
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin/profile"
                onClick={() => setSidebarOpen(false)}
                title="Profile"
                className={`flex items-center justify-center mb-3 p-2 rounded-lg transition-colors ${
                  location.pathname === '/admin/profile'
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                title="Logout"
                className="flex items-center justify-center p-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt size={18} />
              </button>
            </>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="hidden lg:flex items-center justify-center w-full mt-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title={sidebarExpanded ? 'Minimize Sidebar' : 'Expand Sidebar'}
          >
            {sidebarExpanded ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <FaBars size={20} />
              </button>
              <h1 className="text-lg font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h1>
            </div>
            
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHome size={16} />
              <span className="text-sm font-medium hidden sm:inline">View Site</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
