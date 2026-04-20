import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f5f7fb",
        accent: "#0f766e",
        highlight: "#f59e0b"
      },
      fontFamily: {
        sans: [
          "\"Satoshi\"",
          "\"Avenir Next\"",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(15, 118, 110, 0.12), transparent 35%), linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(240, 244, 255, 0.88))",
        "hero-grid-dark":
          "radial-gradient(circle at top, rgba(45, 212, 191, 0.14), transparent 40%), linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98))"
      }
    }
  },
  plugins: []
};

export default config;

