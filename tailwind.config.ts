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
        sans: ["var(--font-source)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        wwam: {
          void: "#1a1210",
          ink: "#120c0a",
          cream: "#f5ebe0",
          "cream-muted": "#b5a394",
          card: "#f9f3ea",
          gold: "#b8922e",
          "gold-light": "#d4b85c",
          dune: "#6b5344",
        },
        axis: { DEFAULT: "#7c2d12", muted: "#9a3412", soft: "#fecaca" },
        allied: { DEFAULT: "#1e3a5f", muted: "#1d4ed8", soft: "#bfdbfe" },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(201, 162, 39, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
