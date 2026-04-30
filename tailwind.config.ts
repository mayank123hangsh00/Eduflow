import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        tertiary: "hsl(var(--tertiary))",
        border: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Nunito", "Inter", "sans-serif"],
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(-5deg)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(20px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "blob": {
          "0%, 100%": { borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" },
          "33%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "66%": { borderRadius: "40% 60% 50% 50% / 40% 60% 50% 60%" },
        }
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-fast": "float-fast 4s ease-in-out infinite",
        "wiggle": "wiggle 2s ease-in-out infinite",
        "pop-in": "pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "blob": "blob 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
