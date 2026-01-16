import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import UserAuthContext from '../../context/UserAuthContext';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [blogsOpen, setBlogsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileBlogsOpen, setMobileBlogsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { user: regularUser } = useContext(UserAuthContext);
  const { user: adminUser } = useContext(AuthContext);
  
  // Determine which user is logged in
  const user = regularUser || adminUser;
  const isAdmin = adminUser && !regularUser;
  const dashboardLink = isAdmin ? '/admin/dashboard' : '/dashboard';
  
  // Use global settings context
  const { settings } = useSettings();
  
  // Debug log
  useEffect(() => {
    console.log('🔍 Header settings:', settings);
    console.log('📸 Logo URL:', settings?.logo);
    console.log('📝 Logo Text:', settings?.logoText);
  }, [settings]);

  // Fetch services and blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const { data: servicesData } = await api.get('/services');
        const serviceList = servicesData.services || servicesData.data || servicesData || [];
        // Filter out "Other Services" category from navbar dropdown
        setServices(serviceList.filter(s => s.active !== false && s.category?.toLowerCase() !== 'other services'));
        
        // Fetch blogs only if enabled in settings
        if (settings?.features?.enableBlog) {
          const { data: blogsData } = await api.get('/blogs');
          const blogList = Array.isArray(blogsData) 
            ? blogsData 
            : (blogsData.blogs || blogsData.data || []);
          
          console.log('Blogs fetched for header:', blogList.length);
          // Get latest 5 blogs (no published filter since model doesn't have that field)
          setBlogs(blogList.slice(0, 5));
        }
      } catch (error) {
        console.log('Data fetch error:', error);
      }
    };
    fetchData();
  }, [settings]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services', hasDropdown: true, type: 'services' },
    ...(settings?.features?.enableBlog ? [{ to: '/blog', label: 'Blog', hasDropdown: true, type: 'blogs' }] : []),
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-md py-2.5' 
        : isHomePage 
          ? 'bg-white/90 backdrop-blur-sm py-3' 
          : 'bg-white/80 backdrop-blur-sm py-3'
    }`}>
      {/* Remove gradient overlay for home page */}
      
      <nav className="container mx-auto px-4 sm:px-6 flex justify-between items-center relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group -my-1">
          {settings?.logo ? (
            <>
              <img 
                src={settings.logo} 
                alt={settings.companyName || 'Logo'} 
                className="h-9 sm:h-10 md:h-11 object-contain"
                style={{ mixBlendMode: 'multiply' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-tr-xl rounded-bl-xl items-center justify-center text-white font-serif text-sm sm:text-base md:text-lg font-bold shadow-md"
                style={{ 
                  display: 'none',
                  background: settings?.brandColors?.secondary
                }}
              >
                {settings?.logoText}
              </div>
            </>
          ) : (
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-serif text-sm sm:text-base md:text-lg font-bold shadow-md"
              style={{ 
                background: settings?.brandColors?.secondary
              }}
            >
              {settings?.logoText}
            </div>
          )}
          <span className="text-base sm:text-lg md:text-xl font-serif font-bold tracking-tight text-primary">
            {settings?.companyName}
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isServicesDropdown = link.type === 'services';
            const isBlogsDropdown = link.type === 'blogs';
            const dropdownOpen = isServicesDropdown ? servicesOpen : isBlogsDropdown ? blogsOpen : false;
            
            return (
              <li 
                key={link.to} 
                className="relative"
                onMouseEnter={() => {
                  if (isServicesDropdown) setServicesOpen(true);
                  if (isBlogsDropdown) setBlogsOpen(true);
                }}
                onMouseLeave={() => {
                  if (isServicesDropdown) setServicesOpen(false);
                  if (isBlogsDropdown) setBlogsOpen(false);
                }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-200 relative group flex items-center gap-1 ${
                      isActive 
                        ? 'font-semibold' 
                        : 'text-gray-800 hover:text-gray-900'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-secondary)' : undefined
                  })}
                >
                  {link.label}
                  {link.hasDropdown && <FaChevronDown className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />}
                </NavLink>
                
                {/* Services Dropdown */}
                {isServicesDropdown && servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {services.length > 0 && services.map((service) => (
                      <Link
                        key={service._id}
                        to={`/services/${service.slug || service._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        style={{
                          '--hover-color': 'var(--color-secondary)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      >
                        {service.title}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/digital-services"
                        className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-secondary/10 hover:text-secondary"
                      >
                        🌐 Digital Services
                      </Link>
                      <Link
                        to="/other-services"
                        className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-secondary/10 hover:text-secondary"
                      >
                        📋 Other Services
                      </Link>
                      <Link
                        to="/services"
                        className="block px-4 py-2 text-sm font-semibold text-primary hover:text-secondary"
                      >
                        View All →
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Blogs Dropdown */}
                {isBlogsDropdown && blogsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {blogs.length > 0 ? (
                      <>
                        {blogs.map((blog) => (
                          <Link
                            key={blog._id}
                            to={`/blog/${blog.slug || blog._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          >
                            <div className="font-medium">{blog.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</div>
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            to="/blog"
                            className="block px-4 py-2 text-sm font-semibold text-primary hover:text-secondary"
                          >
                            View All Blogs →
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No blogs available</div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* CTA Button / User Menu - Original Desktop Size with Dynamic Colors */}
        <div className="hidden lg:flex items-center gap-2.5">
          {user ? (
            <Link
              to={dashboardLink}
              className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 text-white hover:shadow-xl"
              style={{ 
                background: `var(--color-primary)`
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                Login
              </Link>
              <Link
                to="/quote"
                className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl"
                style={{ 
                  background: settings?.brandColors?.secondary,
                  color: settings?.brandColors?.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = settings?.brandColors?.primary;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = settings?.brandColors?.secondary;
                  e.currentTarget.style.color = settings?.brandColors?.primary;
                }}
              >
                Get Quote
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-2xl focus:outline-none transition-colors text-primary"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border-t border-gray-100"
          >
            <ul className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => {
                const isServicesDropdown = link.type === 'services';
                const isBlogsDropdown = link.type === 'blogs';
                const dropdownOpen = isServicesDropdown ? mobileServicesOpen : isBlogsDropdown ? mobileBlogsOpen : false;
                
                return (
                  <li key={link.to}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => {
                            if (isServicesDropdown) setMobileServicesOpen(!mobileServicesOpen);
                            if (isBlogsDropdown) setMobileBlogsOpen(!mobileBlogsOpen);
                          }}
                          className="flex items-center justify-between w-full text-lg font-medium text-primary"
                        >
                          {link.label}
                          <FaChevronDown className={`text-xs text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Mobile Services Dropdown */}
                        {isServicesDropdown && (
                          <AnimatePresence>
                            {mobileServicesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 ml-4 space-y-2 overflow-hidden"
                              >
                                {services.length > 0 && services.map((service) => (
                                  <Link
                                    key={service._id}
                                    to={`/services/${service.slug || service._id}`}
                                    onClick={() => {
                                      setMobileMenu(false);
                                      setMobileServicesOpen(false);
                                    }}
                                    className="block py-2 text-sm text-gray-700 hover:text-secondary"
                                  >
                                    {service.title}
                                  </Link>
                                ))}
                                <Link
                                  to="/digital-services"
                                  onClick={() => {
                                    setMobileMenu(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  className="block py-2 text-sm font-semibold text-primary hover:text-secondary"
                                >
                                  🌐 Digital Services
                                </Link>
                                <Link
                                  to="/other-services"
                                  onClick={() => {
                                    setMobileMenu(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  className="block py-2 text-sm font-semibold text-primary hover:text-secondary"
                                >
                                  📋 Other Services
                                </Link>
                                <Link
                                  to="/services"
                                  onClick={() => {
                                    setMobileMenu(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  className="block py-2 text-sm font-semibold text-primary hover:text-secondary"
                                >
                                  View All →
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                        
                        {/* Mobile Blogs Dropdown */}
                        {isBlogsDropdown && (
                          <AnimatePresence>
                            {mobileBlogsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 ml-4 space-y-2 overflow-hidden"
                              >
                                {blogs.length > 0 ? (
                                  <>
                                    {blogs.map((blog) => (
                                      <Link
                                        key={blog._id}
                                        to={`/blog/${blog.slug || blog._id}`}
                                        onClick={() => {
                                          setMobileMenu(false);
                                          setMobileBlogsOpen(false);
                                        }}
                                        className="block py-2 text-sm text-gray-700 hover:text-secondary"
                                      >
                                        <div className="font-medium">{blog.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</div>
                                      </Link>
                                    ))}
                                    <Link
                                      to="/blog"
                                      onClick={() => {
                                        setMobileMenu(false);
                                        setMobileBlogsOpen(false);
                                      }}
                                      className="block py-2 text-sm font-semibold text-primary hover:text-secondary"
                                    >
                                      View All Blogs →
                                    </Link>
                                  </>
                                ) : (
                                  <div className="py-2 text-sm text-gray-500">No blogs available</div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={link.to}
                        onClick={() => setMobileMenu(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between text-lg font-medium ${
                            isActive ? '' : 'text-gray-800'
                          }`
                        }
                        style={({ isActive }) => ({
                          color: isActive ? 'var(--color-secondary)' : undefined
                        })}
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </li>
                );
              })}
              <li className="pt-4 mt-2 border-t border-gray-100">
                {user ? (
                  <Link
                    to={dashboardLink}
                    className="block text-white px-5 py-2.5 rounded-md text-center text-base font-semibold hover:shadow-lg transition-all"
                    style={{ 
                      background: `linear-gradient(to right, var(--color-primary), var(--color-primary))` 
                    }}
                    onClick={() => setMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block bg-white px-5 py-2.5 rounded-md text-center text-base font-semibold hover:bg-gray-50 transition-all border-2"
                      style={{ 
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                      onClick={() => setMobileMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/quote"
                      className="block px-5 py-2.5 rounded-md text-center text-base font-semibold hover:shadow-lg transition-all"
                      style={{ 
                        background: `var(--color-secondary)`,
                        color: 'var(--color-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-primary)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-secondary)';
                        e.currentTarget.style.color = 'var(--color-primary)';
                      }}
                      onClick={() => setMobileMenu(false)}
                    >
                      Get Quote
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
