/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7ff",
          500: "#4f6ef7",
          700: "#2d3ea6"
        }
      }
    }
  },
  plugins: []
};
