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
        charcoal: {
          950: "#0b0d13", // base background
          900: "#12141d", // card surface
          850: "#171a26", // elevated surface
          800: "#1f2434", // secondary / borders
          700: "#2a3147", // borders / dividers
          600: "#475270", // muted labels
          500: "#6a799c", // secondary text
          400: "#98a6c4", // primary body text
          300: "#c7d2e8", // highlighted text
          200: "#e4eaf7", // headers
        },
        purpleAcc: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#8b5cf6",
          700: "#7c3aed",
          900: "#3b1e6d",
        },
        emeraldAcc: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          900: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

