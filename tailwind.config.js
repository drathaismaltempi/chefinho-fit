/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        verde: '#B9E937',
        coral: '#FF6B6B',
        turquesa: '#4AC0C0',
        amarelo: '#FFF1A8',
      },
      fontFamily: {
        title: ['Poppins', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
}

