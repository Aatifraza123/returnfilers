import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import api from '../../api/axios';

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [services, setServices] = useState([]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        const serviceList = data.services || data.data || data || [];
        setServices(serviceList.filter(s => s.active !== false));
      } catch (error) {
        console.log('Services fetch error');
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-3'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-[#C9A227] to-[#C9A832] rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-serif text-sm sm:text-base md:text-lg font-bold shadow-md">
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
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-base font-medium transition-all duration-200 relative group flex items-center gap-1 ${
                    isActive ? 'text-[#C9A227] font-semibold' : 'text-gray-800 hover:text-[#0B1530]'
                  }`
                }
              >
                {link.label}
                {link.hasDropdown && <FaChevronDown className={`text-xs transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />}
              </NavLink>
              
              {/* Simple Services Dropdown */}
              {link.hasDropdown && servicesOpen && (
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
              {navLinks.map((link) => (
                <li key={link.to}>
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
                    <FaChevronRight className="text-xs text-gray-400" />
                  </NavLink>
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
