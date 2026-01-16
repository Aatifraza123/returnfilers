import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ bottom: 128, right: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  
  const phoneNumber = '918447127264';
  const defaultMessage = 'Hi, I need help with tax and business services';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (window.innerWidth - position.right),
      y: e.clientY - (window.innerHeight - position.bottom)
    });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - (window.innerWidth - position.right),
      y: touch.clientY - (window.innerHeight - position.bottom)
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newRight = window.innerWidth - e.clientX + dragStart.x;
      const newBottom = window.innerHeight - e.clientY + dragStart.y;
      
      // Boundaries
      const maxRight = window.innerWidth - 60;
      const maxBottom = window.innerHeight - 60;
      
      setPosition({
        right: Math.max(10, Math.min(newRight, maxRight)),
        bottom: Math.max(10, Math.min(newBottom, maxBottom))
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      
      const newRight = window.innerWidth - touch.clientX + dragStart.x;
      const newBottom = window.innerHeight - touch.clientY + dragStart.y;
      
      const maxRight = window.innerWidth - 60;
      const maxBottom = window.innerHeight - 60;
      
      setPosition({
        right: Math.max(10, Math.min(newRight, maxRight)),
        bottom: Math.max(10, Math.min(newBottom, maxBottom))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <>
      <div 
        ref={buttonRef}
        className="fixed z-50"
        style={{ 
          bottom: `${position.bottom}px`, 
          right: `${position.right}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-3 bg-white rounded-lg shadow-2xl p-4 w-64 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">ReturnFilers</h4>
                  <p className="text-xs text-gray-500">Replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Hi there! 👋<br />
              How can we help you?
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp size={16} />
              Start Chat
            </button>
          </div>
        )}

        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            if (!isDragging) setIsOpen(!isOpen);
          }}
          className="w-12 h-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#128C7E] transition-all hover:scale-110 active:scale-95"
          aria-label="WhatsApp Chat"
          title="Drag to move | Click to chat"
        >
          <FaWhatsapp size={24} />
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default WhatsAppWidget;
