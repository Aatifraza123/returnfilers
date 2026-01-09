import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.log('Theme settings fetch error');
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.brandColors) {
      // Apply CSS variables to root
      const root = document.documentElement;
      root.style.setProperty('--color-primary', settings.brandColors.primary || '#0B1530');
      root.style.setProperty('--color-secondary', settings.brandColors.secondary || '#C9A227');
      root.style.setProperty('--color-accent', settings.brandColors.accent || '#1a2b5c');
    }
  }, [settings]);

  return <>{children}</>;
};

export default ThemeProvider;
