import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const WhatsAppFloat = () => {
  const [showTooltip, setShowTooltip] = useState(false); // Start hidden
  const [showButton, setShowButton] = useState(false); // Start hidden

  const phoneNumber = "8447127264";
  const message = "Hello! I would like to inquire about your tax and business consulting services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Show tooltip only after button is visible and after delay
  useEffect(() => {
    if (showButton) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 2000);
      
      // Auto-hide after 10 seconds
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 12000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [showButton]);

  // Show button after scrolling down past hero section, but hide when footer is visible
  useEffect(() => {
    // Force initial hidden state
    setShowButton(false);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight - 100;
      
      console.log('WhatsApp Float:', { scrollPosition, viewportHeight, threshold, shouldShow: scrollPosition >= threshold });
      
      // Simple check: hide if scroll is less than viewport height - 100
      if (scrollPosition < threshold) {
        setShowButton(false);
        return;
      }
      
      // Show button after scrolling past hero
      const footer = document.getElementById('footer');
      if (!footer) {
        setShowButton(true);
        return;
      }

      const footerTop = footer.offsetTop;
      const windowBottom = scrollPosition + viewportHeight;

      // Hide when footer is visible
      if (windowBottom >= footerTop - 50) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    // Wait for DOM to be ready
    const initialTimer = setTimeout(() => {
      handleScroll();
    }, 500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 transition-all duration-500 ${
        showButton ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{ 
        visibility: showButton ? 'visible' : 'hidden',
        display: showButton ? 'flex' : 'none',
        transform: showButton ? 'scale(1)' : 'scale(0)'
      }}
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

