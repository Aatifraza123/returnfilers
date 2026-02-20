import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLocation } from 'react-router-dom';

const FacebookPixel = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const pixelId = settings?.seo?.facebookPixelId;

  // Initialize Facebook Pixel
  useEffect(() => {
    if (!pixelId) {
      console.log('❌ Facebook Pixel ID not configured');
      return;
    }

    // Check if pixel already exists
    if (window.fbq) {
      return;
    }

    // Facebook Pixel Code
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');

    console.log('✅ Facebook Pixel initialized:', pixelId);
  }, [pixelId]);

  // Track page views on route change
  useEffect(() => {
    if (!pixelId || !window.fbq) {
      return;
    }

    window.fbq('track', 'PageView');
    console.log('📊 FB Pixel Page view:', location.pathname);
  }, [location, pixelId]);

  return null;
};

export default FacebookPixel;
