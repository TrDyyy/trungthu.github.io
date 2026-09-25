/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        decorative: ['"Noto Serif"', 'serif'],
      },
      colors: {
        sky: {
          950: '#020617',
          900: '#07152f',
          800: '#101d46',
          700: '#1b2455',
        },
        moon: {
          100: '#fff3bf',
          200: '#ffe69a',
          300: '#ffd166',
        },
        lantern: {
          DEFAULT: '#ff922b',
          light: '#ffa94d',
          dark: '#ff6b35',
        },
        gold: {
          DEFAULT: '#ffd43b',
          muted: '#f6c453',
        },
      },
      animation: {
        'twinkle': 'twinkle var(--duration, 3s) ease-in-out infinite var(--delay, 0s)',
        'float-up': 'float-up 8s ease-in-out infinite',
        'sway': 'sway 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'drift': 'drift 30s linear infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'shooting-star': 'shooting-star 1s ease-out forwards',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0.8' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 210, 102, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 210, 102, 0.8)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shooting-star': {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'translateX(200px) translateY(100px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
