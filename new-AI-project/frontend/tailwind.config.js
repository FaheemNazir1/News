/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        forensic: {
          dark: '#08102B',
          darker: '#050A1F',
          blue: '#14285D',
          light: '#F4F5F7',
          accent: '#00FF9D',
          red: '#FF4D4D',
          neutral: '#8E98B0'
        }
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.6))' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        fadeUpDelayed: 'fadeUp 0.8s ease-out 0.2s forwards'
      }
    },
  },
  plugins: [],
}
