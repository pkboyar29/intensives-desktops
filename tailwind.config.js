/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    colors: {
      black: '#232321',
      blue: '#1A5CE5',
      white: '#fff',
      another_white: '#F0F2F5',
      red: 'red',
      gray: '#DBDEE5',
      bright_gray: '#637087',
      thead_cell: '#121217',
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
