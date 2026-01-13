/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dynamic brand colors from CSS variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: 'var(--color-primary)',
          600: 'var(--color-primary)',
          700: 'var(--color-primary)',
          800: 'var(--color-primary)',
          900: 'var(--color-primary)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          500: 'var(--color-secondary)',
          600: 'var(--color-secondary)',
          700: 'var(--color-secondary)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent)',
        },
        neutral: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          800: '#2D3748',
          900: '#0A2540',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Roboto', 'serif'],
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




