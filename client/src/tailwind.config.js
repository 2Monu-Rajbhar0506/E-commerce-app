/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your custom palette
        "primary-200": "#ffbf00",
        "primary-100": "#ffc929",
        "secondary-200": "#00b050",
        "secondary-100": "#0b1a78",

        // Brand colors
        brand: {
          DEFAULT: "#4f46e5",
          light: "#6366f1",
          dark: "#4338ca",
        },
      },

      // Add fill colors here
      fill: {
        "primary-400": "#fbbf24", // IMPORTANT!
      },

      // Custom container behavior
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1120px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },

      // Custom font
      fontFamily: {
        primary: ["Inter", "sans-serif"],
      },
    },
  },

  // Plugins enabled
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};

