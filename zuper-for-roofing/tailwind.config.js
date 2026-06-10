/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        sans: ["DM Sans", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
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
        // Brand palette
        forest: {
          DEFAULT: "hsl(158, 35%, 28%)",
          hover:   "hsl(158, 35%, 22%)",
          light:   "hsl(158, 35%, 94%)",
          mid:     "hsl(158, 30%, 42%)",
          muted:   "hsl(158, 20%, 88%)",
        },
        cream: {
          DEFAULT: "hsl(45, 30%, 97%)",
          dark:    "hsl(40, 22%, 91%)",
          warm:    "hsl(42, 25%, 94%)",
        },
        terra: {
          DEFAULT: "hsl(18, 65%, 55%)",
          dark:    "hsl(18, 65%, 46%)",
          light:   "hsl(18, 65%, 96%)",
          muted:   "hsl(18, 40%, 88%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        warm:    "0 4px 24px rgba(46, 96, 78, 0.10), 0 1px 6px rgba(46, 96, 78, 0.06)",
        "warm-lg": "0 8px 40px rgba(46, 96, 78, 0.13), 0 2px 10px rgba(46, 96, 78, 0.08)",
        terra:   "0 4px 16px rgba(217, 103, 58, 0.30)",
        "terra-lg": "0 6px 24px rgba(217, 103, 58, 0.38)",
        card:    "0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
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
        "fade-slide-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "circle-expand": {
          from: { opacity: "0", transform: "scale(0)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "checkmark-draw": {
          from: { "stroke-dashoffset": "80" },
          to:   { "stroke-dashoffset": "0" },
        },
        "float-particle": {
          "0%":   { opacity: "0", transform: "translateY(0) scale(0)" },
          "20%":  { opacity: "1", transform: "translateY(-8px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-56px) scale(0.5)" },
        },
        shimmer: {
          "0%":   { "background-position": "-200% 0" },
          "100%": { "background-position":  "200% 0" },
        },
        "pulse-ring": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.15", transform: "scale(1.08)" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-slide-up":   "fade-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":        "scale-in 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        "circle-expand":   "circle-expand 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "checkmark-draw":  "checkmark-draw 0.4s ease-out 0.35s forwards",
        "float-particle":  "float-particle var(--duration, 1.2s) ease-out var(--delay, 0s) forwards",
        shimmer:           "shimmer 1.6s linear infinite",
        "pulse-ring":      "pulse-ring 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
