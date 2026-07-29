import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "#111111",
        border: "#222222",

        primary: "#00FF84",
        secondary: "#00CFFF",

        danger: "#FF4D4F",
        warning: "#FFD700",

        muted: "#888888",

        text: "#FFFFFF",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        glow: "0 0 20px rgba(0,255,132,.35)",
        cyan: "0 0 20px rgba(0,207,255,.35)",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      backgroundImage: {
        hero:
          "linear-gradient(180deg,#050505 0%,#0b0f12 100%)",
      },

      animation: {
        float: "float 4s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },

      keyframes: {
        float: {
          "0%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },

        glow: {
          from: {
            boxShadow: "0 0 8px rgba(0,255,132,.2)",
          },
          to: {
            boxShadow: "0 0 25px rgba(0,255,132,.6)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;
