import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        space: ["var(--font-space)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Space theme colors
        "space-blue": "hsl(var(--space-blue))",
        "space-purple": "hsl(var(--space-purple))",
        "space-teal": "hsl(var(--space-teal))",
        "space-orange": "hsl(var(--space-orange))",
        "space-red": "hsl(var(--space-red))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px 0 rgba(var(--space-blue-rgb), 0.5)",
            opacity: "0.8",
          },
          "50%": {
            boxShadow: "0 0 20px 5px rgba(var(--space-blue-rgb), 0.7)",
            opacity: "1",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            backgroundSize: "200% 200%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            backgroundSize: "200% 200%",
          },
        },
        "pulse-border": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(var(--space-blue-rgb), 0)",
            borderColor: "rgba(var(--space-blue-rgb), 0.5)",
          },
          "50%": {
            boxShadow: "0 0 10px 2px rgba(var(--space-blue-rgb), 0.3)",
            borderColor: "rgba(var(--space-blue-rgb), 1)",
          },
        },
        radar: {
          "0%": {
            transform: "scale(1)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(1.5)",
            opacity: "0",
          },
        },
        "text-shimmer": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
        rotate: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "gradient-x": "gradient-x 10s ease infinite",
        "pulse-border-1": "pulse-border 1s ease-in-out infinite",
        "pulse-border-2": "pulse-border 2s ease-in-out infinite",
        "pulse-border-3": "pulse-border 3s ease-in-out infinite",
        radar: "radar 2s ease-out infinite",
        "text-shimmer": "text-shimmer 2s linear infinite",
        "rotate-slow": "rotate 20s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
