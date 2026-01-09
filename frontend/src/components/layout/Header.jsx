import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import UserAuthContext from '../../context/UserAuthContext';
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
  const { user } = useContext(UserAuthContext);
  
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
        setServices(serviceList.filter(s => s.active !== false));
        
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
        ? 'bg-white/95 backdrop-blur-lg shadow-md py-2' 
        : isHomePage 
          ? 'bg-white/90 backdrop-blur-sm py-2.5' 
          : 'bg-white/80 backdrop-blur-sm py-2.5'
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
                className="h-11 sm:h-12 md:h-14 object-contain"
                style={{ mixBlendMode: 'multiply' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#C9A227] to-[#C9A832] rounded-tr-xl rounded-bl-xl items-center justify-center text-white font-serif text-base sm:text-lg md:text-xl font-bold shadow-md"
                style={{ display: 'none' }}
              >
                {settings?.logoText || 'RF'}
              </div>
            </>
          ) : (
            <div 
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#C9A227] to-[#C9A832] rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-serif text-base sm:text-lg md:text-xl font-bold shadow-md"
            >
              {settings?.logoText || 'RF'}
            </div>
          )}
          <span className={`text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors ${
            isHomePage && !scrolled ? 'text-[#0B1530]' : 'text-[#0B1530]'
          }`}>
            {settings?.companyName || 'ReturnFilers'}
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
                    `text-base font-medium transition-all duration-200 relative group flex items-center gap-1 ${
                      isActive 
                        ? 'text-[#C9A227] font-semibold' 
                        : 'text-gray-800 hover:text-[#0B1530]'
                    }`
                  }
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
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/digital-services"
                        className="block px-4 py-2 text-sm font-semibold text-[#0B1530] hover:bg-[#C9A227]/10 hover:text-[#C9A227]"
                      >
                        🌐 Digital Services
                      </Link>
                      <Link
                        to="/services"
                        className="block px-4 py-2 text-sm font-semibold text-[#0B1530] hover:text-[#C9A227]"
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-colors"
                          >
                            <div className="font-medium">{blog.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</div>
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            to="/blog"
                            className="block px-4 py-2 text-sm font-semibold text-[#0B1530] hover:text-[#C9A227]"
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

        {/* CTA Button / User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl bg-[#0B1530] text-white hover:bg-[#C9A227] hover:text-[#0B1530]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full text-base font-medium transition-all duration-300 text-[#0B1530] hover:text-[#C9A227]"
              >
                Login
              </Link>
              <Link
                to="/quote"
                className="px-6 py-2.5 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl bg-[#0B1530] text-white hover:bg-[#C9A227] hover:text-[#0B1530]"
              >
                Get Quote
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-2xl focus:outline-none transition-colors text-[#0B1530]"
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
                          className="flex items-center justify-between w-full text-lg font-medium text-[#0B1530]"
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
                                    className="block py-2 text-sm text-gray-700 hover:text-[#C9A227]"
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
                                  className="block py-2 text-sm font-semibold text-[#0B1530] hover:text-[#C9A227]"
                                >
                                  🌐 Digital Services
                                </Link>
                                <Link
                                  to="/services"
                                  onClick={() => {
                                    setMobileMenu(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  className="block py-2 text-sm font-semibold text-[#0B1530] hover:text-[#C9A227]"
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
                                        className="block py-2 text-sm text-gray-700 hover:text-[#C9A227]"
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
                                      className="block py-2 text-sm font-semibold text-[#0B1530] hover:text-[#C9A227]"
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
                            isActive ? 'text-[#C9A227]' : 'text-[#0B1530]'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </li>
                );
              })}
              <li className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  to="/quote"
                  className="block bg-[#0B1530] text-white px-6 py-3 rounded-xl text-center text-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-all shadow-md"
                  onClick={() => setMobileMenu(false)}
                >
                  Get Quote
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
