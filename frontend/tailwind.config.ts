import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  /* 🔥 IMPORTANT: Safelist for dynamic badge classes */
  safelist: [
    // background
    "bg-brand-softer",
    "bg-danger-soft",
    "bg-success-soft",
    "bg-warning-soft",
    "bg-neutral-primary-soft",
    "bg-neutral-secondary-medium",

    // text
    "text-fg-brand-strong",
    "text-fg-danger-strong",
    "text-fg-success-strong",
    "text-fg-warning",
    "text-heading",

    // borders
    "border-brand",
    "border-danger",
    "border-success",
    "border-warning",
    "border-neutral-primary",
    "border-neutral-secondary",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        /* =====================
           EXISTING (unchanged)
        ====================== */
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        'brand-beige': 'hsl(var(--secondary))',
        'brand-brown': 'hsl(var(--primary))',

        /* =====================
           ✅ BADGE DESIGN TOKENS
        ====================== */
        /* =====================
           ✅ BADGE DESIGN TOKENS
           Updated to use CSS variables for theme consistency
        ====================== */
        brand: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          softer: "hsl(var(--primary) / 0.15)",
        },

        danger: {
          DEFAULT: "hsl(var(--error) / <alpha-value>)",
          soft: "hsl(var(--error) / 0.15)",
        },

        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          soft: "hsl(var(--success) / 0.15)",
        },

        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          soft: "hsl(var(--warning) / 0.15)",
        },
        
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          soft: "hsl(var(--info) / 0.15)",
        },

        neutral: {
          primary: "hsl(var(--muted-foreground) / <alpha-value>)",
          "primary-soft": "hsl(var(--muted) / 0.5)",
          secondary: "hsl(var(--muted-foreground) / 0.8)",
          "secondary-medium": "hsl(var(--muted) / <alpha-value>)",
        },

        /* Text tokens */
        "fg-brand-strong": "hsl(var(--primary))",
        "fg-danger-strong": "hsl(var(--error))",
        "fg-success-strong": "hsl(var(--success))",
        "fg-warning": "hsl(var(--warning))",

        heading: "hsl(var(--foreground))",
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
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};

export default config;
