import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const PromoBanner = () => {
  const [settings, setSettings] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.log('Settings fetch error');
      }
    };
    fetchSettings();
  }, []);

  // Don't render if banner is disabled or not visible
  if (!settings?.promotional?.bannerEnabled || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    // Store in session storage so it doesn't show again in this session
    sessionStorage.setItem('promoBannerClosed', 'true');
  };

  // Check if banner was closed in this session
  useEffect(() => {
    const wasClosed = sessionStorage.getItem('promoBannerClosed');
    if (wasClosed) {
      setIsVisible(false);
    }
  }, []);

  const bannerContent = (
    <div className="bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1530] py-2.5 px-4 relative">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="text-sm md:text-base font-semibold">
            {settings.promotional.bannerText}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0B1530]/20 hover:bg-[#0B1530]/30 flex items-center justify-center transition-colors"
          aria-label="Close banner"
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  );

  // If there's a link, wrap in Link component
  if (settings.promotional.bannerLink) {
    return (
      <Link to={settings.promotional.bannerLink} className="block hover:opacity-90 transition-opacity">
        {bannerContent}
      </Link>
    );
  }

  return bannerContent;
};

export default PromoBanner;
