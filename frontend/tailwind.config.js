/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #0B1530)',
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: 'var(--color-primary, #0B1530)',
          600: '#0A56A8',
          700: '#08478D',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #C9A227)',
          500: 'var(--color-secondary, #C9A227)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #1a2b5c)',
          500: 'var(--color-accent, #1a2b5c)',
          600: '#00A693',
        },
        neutral: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          800: '#2D3748',
          900: '#0A2540',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}




