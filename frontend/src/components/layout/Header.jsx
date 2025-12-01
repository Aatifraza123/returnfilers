import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/blog', label: 'Blog' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl shadow-lg py-3 border-b border-white/10'
          : 'backdrop-blur-xl py-4'
      }`}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity group">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-tr-2xl rounded-bl-2xl flex items-center justify-center font-serif text-xs sm:text-sm font-bold shadow-md sm:shadow-lg group-hover:shadow-xl transition-all ${
            scrolled 
              ? 'bg-gradient-to-br from-[#D4AF37] to-[#C9A832] text-white' 
              : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
          }`}>
            CA
          </div>
          <span className={`text-lg sm:text-2xl md:text-3xl font-serif font-bold tracking-tight transition-colors ${
            scrolled ? 'text-[#0B1530]' : 'text-white'
          }`}>
            Associates
            <span className="text-[#D4AF37]">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <motion.li 
              key={link.to}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-base font-sans font-medium transition-all duration-300 relative group ${
                    scrolled
                      ? isActive 
                        ? 'text-[#D4AF37] font-semibold' 
                        : 'text-gray-700 hover:text-[#0B1530]'
                      : isActive
                        ? 'text-[#D4AF37] font-semibold'
                        : 'text-white/90 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Underline that appears when active OR hovered */}
                    <motion.span
                      initial={false}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      whileHover={{ width: '100%' }}
                      className="absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300"
                    />
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link
            to="/quote"
            className={`px-6 py-2.5 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
              scrolled
                ? 'bg-[#0B1530] text-white hover:bg-[#D4AF37] hover:text-[#0B1530]'
                : 'bg-[#D4AF37] text-white hover:bg-white hover:text-[#0B1530]'
            }`}
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden text-2xl focus:outline-none transition-colors ${
            scrolled ? 'text-[#0B1530]' : 'text-white'
          }`}
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
            className={`lg:hidden backdrop-blur-2xl shadow-2xl overflow-hidden border-t transition-all ${
              scrolled 
                ? 'bg-white/90 border-gray-100/50' 
                : 'bg-[#0B1530]/90 border-white/10'
            }`}
          >
            <ul className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-lg font-serif font-medium transition-colors ${
                        scrolled
                          ? isActive ? 'text-[#D4AF37]' : 'text-[#0B1530]'
                          : isActive ? 'text-[#D4AF37]' : 'text-white'
                      }`
                    }
                  >
                    {link.label}
                    <FaChevronRight className="text-xs text-gray-400" />
                  </NavLink>
                </li>
              ))}
              <li className={`pt-4 mt-2 border-t ${scrolled ? 'border-gray-100' : 'border-white/10'}`}>
                <Link
                  to="/quote"
                  className={`block px-6 py-3 rounded-xl text-center text-lg font-semibold transition-all shadow-md ${
                    scrolled
                      ? 'bg-[#0B1530] text-white hover:bg-[#D4AF37] hover:text-[#0B1530]'
                      : 'bg-[#D4AF37] text-white hover:bg-white hover:text-[#0B1530]'
                  }`}
                  onClick={() => setMobileMenu(false)}
                >
                  Get Quote
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;





