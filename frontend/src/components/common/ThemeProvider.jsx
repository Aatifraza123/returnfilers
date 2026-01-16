import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const ThemeProvider = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.brandColors) {
      console.log('🎨 Loading brand colors from settings:', settings.brandColors);
      
      // Apply CSS variables to root
      const root = document.documentElement;
      
      // Brand Colors - NO FALLBACKS
      const primary = settings.brandColors.primary;
      const secondary = settings.brandColors.secondary;
      const accent = settings.brandColors.accent;
      
      console.log('Primary:', primary, 'Secondary:', secondary, 'Accent:', accent);
      
      if (primary) {
        root.style.setProperty('--color-primary', primary);
        console.log('✅ Set --color-primary to:', primary);
        
        // RGB values for gradients
        const primaryRgb = hexToRgb(primary);
        if (primaryRgb) {
          root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
          root.style.setProperty('--color-primary-10', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`);
          root.style.setProperty('--color-primary-90', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.9)`);
          root.style.setProperty('--color-primary-70', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.7)`);
        }
      }
      
      if (secondary) {
        root.style.setProperty('--color-secondary', secondary);
        console.log('✅ Set --color-secondary to:', secondary);
        
        // RGB values for secondary
        const secondaryRgb = hexToRgb(secondary);
        if (secondaryRgb) {
          root.style.setProperty('--color-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
          root.style.setProperty('--color-secondary-10', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1)`);
          root.style.setProperty('--color-secondary-light', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1)`);
        }
      }
      
      if (accent) {
        root.style.setProperty('--color-accent', accent);
      }
      
      // Background light
      root.style.setProperty('--color-bg-light', '#ffffff');
      
      // Footer Colors
      if (settings.brandColors.footerBg) {
        root.style.setProperty('--color-footer-bg', settings.brandColors.footerBg);
      }
      if (settings.brandColors.footerText) {
        root.style.setProperty('--color-footer-text', settings.brandColors.footerText);
      }
      if (settings.brandColors.footerLink) {
        root.style.setProperty('--color-footer-link', settings.brandColors.footerLink);
      }
      if (settings.brandColors.footerCompanyName) {
        root.style.setProperty('--color-footer-company', settings.brandColors.footerCompanyName);
      }
      
      // Apply same colors to section variables for consistency
      if (primary) {
        root.style.setProperty('--hero-bg', primary);
        root.style.setProperty('--services-title', primary);
        root.style.setProperty('--btn-primary-bg', primary);
        root.style.setProperty('--btn-secondary-hover-bg', primary);
        root.style.setProperty('--btn-secondary-text', primary);
        root.style.setProperty('--btn-primary-hover-text', primary);
      }
      
      if (secondary) {
        root.style.setProperty('--hero-subtitle', secondary);
        root.style.setProperty('--services-subtitle', secondary);
        root.style.setProperty('--services-card-icon', secondary);
        root.style.setProperty('--btn-primary-hover-bg', secondary);
        root.style.setProperty('--btn-secondary-bg', secondary);
      }
      
      root.style.setProperty('--hero-title', '#FFFFFF');
      root.style.setProperty('--services-bg', '#F9FAFB');
      root.style.setProperty('--btn-primary-text', '#FFFFFF');
      root.style.setProperty('--btn-secondary-hover-text', '#FFFFFF');
      
      console.log('🎨 Theme colors applied successfully!');
    } else {
      console.log('⚠️ No brand colors found in settings');
    }
  }, [settings]);

  return <>{children}</>;
};

export default ThemeProvider;
