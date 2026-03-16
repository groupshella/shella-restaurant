import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F97316",
          light: "#FB923C",
          dark: "#EA6C0A",
        },
        gold: {
          DEFAULT: "#D4910A",
          light: "#F0A429",
          bright: "#F5C45A",
        },
        dark: {
          base: "#0D0A07",
          surface: "#131009",
          elevated: "#1A1510",
          overlay: "#221C14",
        },
        cream: {
          100: "#FFF8F0",
          200: "#F5E6D0",
          400: "rgba(235,210,175,0.65)",
          500: "rgba(210,185,150,0.45)",
          600: "rgba(190,165,130,0.30)",
        },
      },
      fontFamily: {
        arabic: ["var(--font-tajawal)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
