import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const ThemeProvider = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.brandColors) {
      // Apply CSS variables to root
      const root = document.documentElement;
      root.style.setProperty('--color-primary', settings.brandColors.primary || '#0B1530');
      root.style.setProperty('--color-secondary', settings.brandColors.secondary || '#C9A227');
      root.style.setProperty('--color-accent', settings.brandColors.accent || '#1a2b5c');
      
      console.log('🎨 Brand colors applied:', settings.brandColors);
    }
  }, [settings]);

  return <>{children}</>;
};

export default ThemeProvider;
