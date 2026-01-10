import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const ThemeProvider = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.brandColors) {
      // Apply CSS variables to root
      const root = document.documentElement;
      
      // Brand Colors
      root.style.setProperty('--color-primary', settings.brandColors.primary || '#0B1530');
      root.style.setProperty('--color-secondary', settings.brandColors.secondary || '#C9A227');
      root.style.setProperty('--color-accent', settings.brandColors.accent || '#1E3A8A');
      
      // Footer Colors
      root.style.setProperty('--color-footer-bg', settings.brandColors.footerBg || '#0B1530');
      root.style.setProperty('--color-footer-text', settings.brandColors.footerText || '#ffffff');
      root.style.setProperty('--color-footer-link', settings.brandColors.footerLink || '#C9A227');
      root.style.setProperty('--color-footer-company', settings.brandColors.footerCompanyName || '#C9A227');
      
      console.log('🎨 Theme colors applied:', settings.brandColors);
    }
  }, [settings]);

  return <>{children}</>;
};

export default ThemeProvider;
