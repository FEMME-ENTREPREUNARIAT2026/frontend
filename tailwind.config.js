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
        gold: { DEFAULT: '#FFC107', light: '#FFE082', dark: '#FF8F00' },
        petrol: { DEFAULT: '#00695C', light: '#4DB6AC', dark: '#004D40' },
        lavender: { DEFAULT: '#B39DDB', light: '#D1C4E9', dark: '#7E57C2' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
