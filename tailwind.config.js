/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        espresso: '#2C1E16',
        rose: '#D48C94',
        gold: '#C59B43',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
};
