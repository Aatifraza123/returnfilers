import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import api from '../../api/axios';

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        const serviceList = data.services || data.data || data || [];
        setServices(serviceList.filter(s => s.active !== false).slice(0, 12));
      } catch (error) {
        console.log('Services fetch error');
      }
    };
    fetchServices();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services', hasDropdown: true },
    { to: '/blog', label: 'Blog' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleServiceClick = (slug) => {
    setServicesOpen(false);
    navigate(`/services/${slug}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-md py-2'
          : 'bg-white/80 backdrop-blur-sm py-3'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-[#C9A227] to-[#C9A832] rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-serif text-sm sm:text-base md:text-lg font-bold shadow-md group-hover:shadow-lg transition-shadow">
            TF
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#0B1530] tracking-tight">
            Tax Filer
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li 
              key={link.to} 
              className="relative"
              onMouseEnter={() => link.hasDropdown && setServicesOpen(true)}
              onMouseLeave={() => link.hasDropdown && setServicesOpen(false)}
            >
              {link.hasDropdown ? (
                <>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-base font-sans font-medium transition-all duration-200 relative group flex items-center gap-1 ${
                        isActive ? 'text-[#C9A227] font-semibold' : 'text-gray-800 hover:text-[#0B1530]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <FaChevronDown className={`text-xs transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-[#C9A227] transition-all duration-300 ${
                            isActive ? 'w-full' : 'w-0 group-hover:w-full'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                  
                  {/* Services Dropdown */}
                  <AnimatePresence>
                    {servicesOpen && services.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-4 bg-gradient-to-r from-[#0B1530] to-[#1a2b5e]">
                          <h3 className="text-white font-bold text-lg">Our Services</h3>
                          <p className="text-gray-300 text-sm">Professional tax & compliance solutions</p>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                          {services.map((service) => (
                            <button
                              key={service._id}
                              onClick={() => handleServiceClick(service.slug || service._id)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#C9A227]/10 transition-all duration-200 text-left group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#0B1530]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A227]/20 transition-colors">
                                <span className="text-[#C9A227] text-lg">₹</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#0B1530] truncate group-hover:text-[#C9A227] transition-colors">
                                  {service.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ₹{service.price} • {service.timeline || '3-7 Days'}
                                </p>
                              </div>
                              <FaChevronRight className="text-xs text-gray-300 group-hover:text-[#C9A227] transition-colors" />
                            </button>
                          ))}
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                          <Link
                            to="/services"
                            onClick={() => setServicesOpen(false)}
                            className="block text-center text-sm font-semibold text-[#0B1530] hover:text-[#C9A227] transition-colors"
                          >
                            View All Services →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-base font-sans font-medium transition-all duration-200 relative group ${
                      isActive ? 'text-[#C9A227] font-semibold' : 'text-gray-800 hover:text-[#0B1530]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#C9A227] transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link
            to="/quote"
            className="bg-[#0B1530] text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-[#C9A227] hover:text-[#0B1530] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-2xl text-[#0B1530] focus:outline-none"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border-t border-gray-100"
          >
            <ul className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="flex items-center justify-between w-full text-lg font-serif font-medium text-[#0B1530]"
                      >
                        {link.label}
                        <FaChevronDown className={`text-xs transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 ml-4 space-y-2 overflow-hidden"
                          >
                            {services.slice(0, 8).map((service) => (
                              <Link
                                key={service._id}
                                to={`/services/${service.slug || service._id}`}
                                onClick={() => { setMobileMenu(false); setMobileServicesOpen(false); }}
                                className="block py-2 text-sm text-gray-600 hover:text-[#C9A227] border-l-2 border-gray-200 pl-3 hover:border-[#C9A227] transition-all"
                              >
                                {service.title}
                              </Link>
                            ))}
                            <Link
                              to="/services"
                              onClick={() => { setMobileMenu(false); setMobileServicesOpen(false); }}
                              className="block py-2 text-sm font-semibold text-[#C9A227] pl-3"
                            >
                              View All →
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between text-lg font-serif font-medium ${
                          isActive ? 'text-[#C9A227]' : 'text-[#0B1530]'
                        }`
                      }
                    >
                      {link.label}
                      <FaChevronRight className="text-xs text-gray-400" />
                    </NavLink>
                  )}
                </li>
              ))}
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
