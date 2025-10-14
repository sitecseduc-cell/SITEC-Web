/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        orange: {
          100: '#ffedd5',
          400: '#fb923c',
          600: '#f97316',
          700: '#ea580c',
          900: '#7c2d12',
        },
        red: {
          100: '#fee2e2',
          400: '#f87171',
          600: '#ef4444',
          700: '#dc2626',
          900: '#7f1d1d',
        },
        green: {
          100: '#dcfce7',
          400: '#4ade80',
          600: '#22c55e',
          700: '#16a34a',
          900: '#14532d',
        },
      }
    },
  },
  plugins: [],
}