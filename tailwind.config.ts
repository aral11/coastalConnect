import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        coastal: {
          50: "hsl(var(--coastal-50))",
          100: "hsl(var(--coastal-100))",
          200: "hsl(var(--coastal-200))",
          300: "hsl(var(--coastal-300))",
          400: "hsl(var(--coastal-400))",
          500: "hsl(var(--coastal-500))",
          600: "hsl(var(--coastal-600))",
          700: "hsl(var(--coastal-700))",
          800: "hsl(var(--coastal-800))",
          900: "hsl(var(--coastal-900))",
          950: "hsl(var(--coastal-950))",
        },
        ocean: {
          50: "hsl(var(--ocean-50))",
          100: "hsl(var(--ocean-100))",
          200: "hsl(var(--ocean-200))",
          300: "hsl(var(--ocean-300))",
          400: "hsl(var(--ocean-400))",
          500: "hsl(var(--ocean-500))",
          600: "hsl(var(--ocean-600))",
          700: "hsl(var(--ocean-700))",
          800: "hsl(var(--ocean-800))",
          900: "hsl(var(--ocean-900))",
          950: "hsl(var(--ocean-950))",
        },
        coral: {
          50: "hsl(var(--coral-50))",
          100: "hsl(var(--coral-100))",
          200: "hsl(var(--coral-200))",
          300: "hsl(var(--coral-300))",
          400: "hsl(var(--coral-400))",
          500: "hsl(var(--coral-500))",
          600: "hsl(var(--coral-600))",
          700: "hsl(var(--coral-700))",
          800: "hsl(var(--coral-800))",
          900: "hsl(var(--coral-900))",
          950: "hsl(var(--coral-950))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-coastal': 'linear-gradient(135deg, hsl(var(--coastal-600)), hsl(var(--coastal-700)))',
        'gradient-ocean': 'linear-gradient(135deg, hsl(var(--ocean-500)), hsl(var(--coastal-600)))',
        'gradient-coral': 'linear-gradient(135deg, hsl(var(--coral-500)), hsl(var(--coral-600)))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'coastal': '0 10px 25px -3px rgba(45, 90, 90, 0.15), 0 4px 6px -2px rgba(45, 90, 90, 0.08)',
        'ocean': '0 20px 25px -5px rgba(45, 90, 90, 0.12), 0 10px 10px -5px rgba(45, 90, 90, 0.06)',
        'coral': '0 10px 25px -3px rgba(234, 88, 85, 0.15), 0 4px 6px -2px rgba(234, 88, 85, 0.08)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wave": "wave 6s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/line-clamp")],
} satisfies Config;
