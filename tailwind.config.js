/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1412', // ebony
        accent: '#C5A059',  // champagne gold
        whatsapp: '#0B4F37', // emerald luxury
        background: '#FDFBF7', // gallery cream
      },
      fontFamily: {
        display: ['"TAN Pearl"', 'Playfair Display', 'serif'], 
        serif: ['Cinzel', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px', // Needed for FAB Nav pill
      }
    },
  },
  plugins: [],
}
