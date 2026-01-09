import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const PromoBanner = () => {
  const [settings, setSettings] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  console.log('🎨 PromoBanner component mounted');

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔍 Fetching settings for promo banner...');
        const { data } = await api.get('/settings');
        console.log('📦 Full settings response:', data);
        if (data.success) {
          setSettings(data.data);
          console.log('✅ Settings set successfully');
          console.log('🎯 Promotional object:', data.data.promotional);
          console.log('🎯 Banner Enabled:', data.data.promotional?.bannerEnabled);
          console.log('🎯 Banner Text:', data.data.promotional?.bannerText);
        }
      } catch (error) {
        console.error('❌ Settings fetch error:', error);
      }
    };
    fetchSettings();
  }, []);

  // Check if banner was closed in this session
  useEffect(() => {
    const wasClosed = sessionStorage.getItem('promoBannerClosed');
    console.log('📝 Session storage check - promoBannerClosed:', wasClosed);
    if (wasClosed) {
      console.log('⚠️ Banner was closed in this session');
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    console.log('❌ User closed banner');
    setIsVisible(false);
    sessionStorage.setItem('promoBannerClosed', 'true');
  };

  console.log('🎨 PromoBanner render check:', {
    hasSettings: !!settings,
    bannerEnabled: settings?.promotional?.bannerEnabled,
    bannerText: settings?.promotional?.bannerText,
    isVisible,
    willRender: settings?.promotional?.bannerEnabled && isVisible
  });

  // Don't render if banner is disabled or not visible
  if (!settings?.promotional?.bannerEnabled || !isVisible) {
    console.log('🚫 Banner NOT rendering because:', {
      bannerEnabled: settings?.promotional?.bannerEnabled,
      isVisible,
      reason: !settings?.promotional?.bannerEnabled ? 'Banner disabled in settings' : 'Banner closed by user'
    });
    return null;
  }

  console.log('✅ Banner WILL render now!');

  const bannerContent = (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1530] py-2.5 px-4 z-[60]">
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
