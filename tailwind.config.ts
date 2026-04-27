import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151915",
        moss: "#174A3C",
        leaf: "#25D366",
        mint: "#DDF7E8",
        fog: "#F4F7F5",
        line: "#DCE5DF",
        amber: "#F4B942",
        coral: "#F36B5F"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(21, 25, 21, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
