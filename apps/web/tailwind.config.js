/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 18px 40px rgba(59, 130, 246, 0.18)",
        float: "0 10px 20px rgba(15, 23, 42, 0.15)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2rem",
        "4xl": "2.5rem"
      },
      colors: {
        sky: {
          25: "#f2fbff",
          50: "#e6f7ff",
          100: "#ccefff",
          200: "#9edcff",
          300: "#75c8ff",
          400: "#5bb5ff",
          500: "#449eff",
          600: "#3185f2"
        },
        candy: {
          50: "#fff1f8",
          200: "#ffb8dc",
          400: "#ff6fb5",
          500: "#ff4aa1"
        },
        sunny: {
          100: "#fff4bf",
          300: "#ffd66b",
          400: "#ffc23d"
        }
      }
    }
  },
  plugins: []
};
