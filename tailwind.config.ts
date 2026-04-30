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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        brand: {
          50: "hsl(240, 5%, 96%)",
          100: "hsl(240, 5%, 90%)",
          200: "hsl(240, 5%, 84%)",
          300: "hsl(240, 5%, 65%)",
          400: "hsl(240, 5%, 45%)",
          500: "hsl(240, 4%, 16%)",
          600: "hsl(240, 5%, 12%)",
          700: "hsl(240, 5%, 10%)",
          800: "hsl(240, 6%, 6%)",
          900: "hsl(240, 10%, 4%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "aurora-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(5vw, -5vh) scale(1.1)" },
          "66%": { transform: "translate(-2vw, 2vh) scale(0.9)" },
        },
        "aurora-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-5vw, 3vh) scale(0.9)" },
          "66%": { transform: "translate(2vw, -2vh) scale(1.1)" },
        },
        "aurora-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(2vw, 2vh) scale(1.1)" },
          "66%": { transform: "translate(-3vw, -5vh) scale(0.9)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "reverse-spin": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "aurora-1": "aurora-1 20s ease-in-out infinite",
        "aurora-2": "aurora-2 25s ease-in-out infinite",
        "aurora-3": "aurora-3 30s ease-in-out infinite",
        "spin-slow": "spin-slow 15s linear infinite",
        "reverse-spin": "reverse-spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
