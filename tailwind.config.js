/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor : {
        'maincolor':"#f5f5f5",
        'bgcolor':"green",
        primary : "#00acb4",
        secondary : "#058187"
      },
      colors : {
        maincolor:"#f5f5f5",
        primary : "#00acb4",
        secondary : "#058187"
      }
    },
  },
  plugins: [],
}

