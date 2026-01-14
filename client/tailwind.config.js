/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f14',
          800: '#16161d',
          700: '#1e1e27',
          600: '#262631',
          500: '#2f2f3d',
        },
        accent: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          emerald: '#10b981',
          orange: '#f97316',
          pink: '#ec4899',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
