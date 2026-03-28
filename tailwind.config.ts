import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        sand: {
          50: "#faf6ef",
          100: "#f2e8d5",
          200: "#e4d0ae",
          300: "#d4b37e",
          400: "#c49452",
          500: "#b67a36",
          600: "#9e612c",
          700: "#834b27",
          800: "#6c3e26",
          900: "#5c3524",
        },
        axis: { DEFAULT: "#7c2d12", muted: "#9a3412", soft: "#fecaca" },
        allied: { DEFAULT: "#1e3a5f", muted: "#1d4ed8", soft: "#bfdbfe" },
      },
    },
  },
  plugins: [],
};

export default config;
