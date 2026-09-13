/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5B3DF5',
          light: '#E8DEFF',
          dark: '#25272C',
          mint: '#B8F7E4',
        },
      },
    },
  },
  plugins: [],
};
