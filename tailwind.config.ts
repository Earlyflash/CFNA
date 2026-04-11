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
        sans: ["var(--font-lora)", "Georgia", "serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-special-elite)", "Courier New", "monospace"],
      },
      colors: {
        np: {
          paper: "#f5f0e1",
          "paper-dark": "#e8dcc8",
          ink: "#1a1a1a",
          "ink-light": "#3d3d3d",
          "ink-muted": "#6b6b6b",
          rule: "#8b7d6b",
          "rule-light": "#c4b79f",
          aged: "#d4c5a9",
          red: "#8b0000",
          "red-light": "#a52a2a",
        },
        axis: { DEFAULT: "#7c2d12", muted: "#9a3412", soft: "#fecaca" },
        allied: { DEFAULT: "#1e3a5f", muted: "#2c5282", soft: "#bfdbfe" },
      },
      boxShadow: {
        print: "2px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
