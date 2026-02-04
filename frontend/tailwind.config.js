/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': {
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
        },
        'pastel-pink': {
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
        }
      }
    }
  },
  plugins: [],
}