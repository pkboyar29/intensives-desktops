/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    colors: {
      black: '#232321',
      black_2: '#121217',
      black_3: '#333',
      blue: '#1a5ce5',
      dark_blue: '#184bb5',
      bright_blue: '#e0e7ff',
      white: '#fff',
      another_white: '#f0f2f5',
      red: 'red',
      gray: '#dbdee5',
      bright_gray: '#637087',
      gray_3: '#6b7280',
      gray_4: '#d6ddec',
      gray_5: '#e8edf2',
      gray_6: '#d9dee3',
      gray_7: '#667080',
      gray_8: '#f1f5f9',
      gray_9: '#e5e7eb',
      black_gray: '#bdbebf',
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
