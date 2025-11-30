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
      setScrolled(window.scrollY > 20);
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
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-lg shadow-sm py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-serif font-bold text-[#0B1530] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white font-sans text-lg font-bold shadow-lg">
            CA
          </div>
          <span className="tracking-tight">Associates</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-base font-sans font-medium transition-all duration-200 relative group ${
                    isActive ? 'text-[#D4AF37] font-semibold' : 'text-gray-800 hover:text-[#0B1530]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Underline that appears when active OR hovered */}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link
            to="/quote"
            className="bg-[#0B1530] text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-[#D4AF37] hover:text-[#0B1530] transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-lg font-serif font-medium ${
                        isActive ? 'text-[#D4AF37]' : 'text-[#0B1530]'
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
                  className="block bg-[#0B1530] text-white px-6 py-3 rounded-xl text-center text-lg font-semibold hover:bg-[#D4AF37] hover:text-[#0B1530] transition-all shadow-md"
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





