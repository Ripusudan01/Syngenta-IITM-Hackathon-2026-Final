/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        syngenta: {
          dark: '#061A13',
          green: '#059669',
          light: '#10B981',
        }
      }
    },
  },
  plugins: [],
}