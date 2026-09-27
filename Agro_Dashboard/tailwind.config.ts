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
        farm: {
          bg: "#F7F9F7",
          card: "#FFFFFF",
          border: "#E5E7EB",
          primary: "#16A34A",
          dark: "#166534",
          light: "#DCFCE7",
          veryLight: "#F0FDF4",
          text: "#111827",
          secondary: "#6B7280",
          muted: "#9CA3AF",
          warning: "#F59E0B",
          critical: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        'card': '18px',
        'panel': '22px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
