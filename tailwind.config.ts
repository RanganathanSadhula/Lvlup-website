import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0e0f12", 2: "#15161b", 3: "#1d1e24", 4: "#2a2b33" },
        cream: { DEFAULT: "#f3f1ec", 2: "#e4e1da" },
        peach: "#ffe2d4",
        brand: { DEFAULT: "#ff6b2c", light: "#ff8a4c", dark: "#f4581c" },
        muted: { DEFAULT: "#5f6068", dark: "#a2a3ab" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { page: "1200px" },
      backgroundImage: {
        "brand-gradient": "linear-gradient(180deg,#ff8a4c 0%,#ff6b2c 45%,#f4581c 100%)",
      },
      boxShadow: {
        glow: "0 12px 32px -8px rgba(255,107,44,0.55)",
        card: "0 1px 0 rgba(0,0,0,0.02)",
      },
    },
  },
  plugins: [],
};

export default config;
