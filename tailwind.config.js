/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#455785",
          accent: "#fcc749",
          muted: "#f7f7f7",
          dark: "#2f3d64",
        },
      },
      fontFamily: {
        sans: ["Tajawal", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.1)",
        elevated: "0 8px 20px rgba(0,0,0,0.15)",
      },
      backgroundImage: {
        "grid-pattern": "url('https://www.transparenttextures.com/patterns/cubes.png')",
      },
    },
  },
  plugins: [],
};
