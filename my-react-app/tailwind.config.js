/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1F33",
          soft: "#1A3348",
          muted: "#4A657A",
        },
        paper: {
          DEFAULT: "#F3F6F9",
          card: "#FFFFFF",
          line: "#D7E0E8",
        },
        accent: {
          DEFAULT: "#0F766E",
          hover: "#0D5F59",
          soft: "#CCFBF1",
        },
        warn: "#B45309",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Outfit"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(11, 31, 51, 0.18)",
        lift: "0 16px 40px -16px rgba(11, 31, 51, 0.22)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.45s ease-out both",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
