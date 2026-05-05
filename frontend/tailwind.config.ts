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
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c97a",
          dark: "#8b6914",
        },
        dark: {
          DEFAULT: "#0e0e0e",
          2: "#1a1a1a",
          3: "#242424",
        },
        epoxy: {
          teal: "#3d8c6e",
          teal2: "#56bf97",
        },
        light: "#f5f0e8",
        muted: "#9a8f7f",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "pulse-gold": "pulseGold 2s infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
