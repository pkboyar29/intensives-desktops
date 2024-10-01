/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    colors: {
      black: '#232321',
      blue: '#1a5ce5',
      dark_blue: '#184bb5',
      white: '#fff',
      another_white: '#f0f2f5',
      red: 'red',
      gray: '#dbdee5',
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
