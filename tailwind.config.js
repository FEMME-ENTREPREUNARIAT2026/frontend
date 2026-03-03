/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fuchsia: { DEFAULT: '#E91E63', light: '#F48FB1', dark: '#AD1457' },
        gold: { DEFAULT: '#C9A84C', light: '#F0D060', dark: '#A07820' },
        petrol: { DEFAULT: '#00695C', light: '#4DB6AC', dark: '#004D40' },
        lavender: { DEFAULT: '#B39DDB', light: '#D1C4E9', dark: '#7E57C2' },
        rose: { DEFAULT: '#F43F5E', light: '#FDA4AF', dark: '#BE123C' },
        cream: '#FDF8F3',
        blush: '#FFF0F7',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Nunito', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'glow-fuchsia': '0 0 30px rgba(233,30,99,0.2)',
        'glow-gold': '0 0 30px rgba(201,168,76,0.25)',
        'soft': '0 4px 24px rgba(0,0,0,0.07)',
        'premium': '0 12px 48px rgba(0,0,0,0.12)',
        'card': '0 2px 16px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
