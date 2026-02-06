import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const WhatsAppFloat = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [showButton, setShowButton] = useState(false); // New state for scroll visibility

  const phoneNumber = "8447127264";
  const message = "Hello! I would like to inquire about your tax and business consulting services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Automatically hide the tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Show button after scrolling down past hero section, but hide when footer is visible
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      const scrollPosition = window.scrollY;
      
      // Hide on any page's hero section (first viewport)
      if (scrollPosition < window.innerHeight) {
        setShowButton(false);
        return;
      }
      
      if (!footer) {
        // If footer not found, show button after hero section
        setShowButton(scrollPosition >= window.innerHeight);
        return;
      }

      const footerTop = footer.offsetTop;
      const windowBottom = scrollPosition + window.innerHeight;

      // Show button after hero section
      // Hide button when footer is visible (when window bottom reaches footer top)
      if (scrollPosition >= window.innerHeight && windowBottom < footerTop - 50) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 transition-opacity duration-500 ${
        showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Tooltip Message */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="bg-white px-4 py-3 rounded-xl shadow-xl border border-gray-100 relative max-w-xs mr-2"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-500 transition-colors"
            >
              <FaTimes size={10} />
            </button>

            <p className="text-gray-800 text-sm font-medium">
              Need help with tax filing? <br />
              <span className="text-green-600 font-bold">Chat with us now!</span>
            </p>

            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Container */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-[#25D366] rounded-full"
        />

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          className="relative z-10 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-green-500/40 transition-all duration-300"
          onMouseEnter={() => setShowTooltip(true)}
        >
          <FaWhatsapp className="text-white text-3xl md:text-4xl" />
        </motion.a>
      </div>
    </div>
  );
};

export default WhatsAppFloat;

