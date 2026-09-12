import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#050816",
          secondary: "#0a0e27",
          tertiary: "#10152e",
          card: "rgba(15, 20, 50, 0.6)",
          cardHover: "rgba(20, 28, 65, 0.8)",
          glass: "rgba(255, 255, 255, 0.03)",
          glassBorder: "rgba(255, 255, 255, 0.06)",
        },
        content: {
          primary: "#e8eaed",
          secondary: "#9ba3b5",
          tertiary: "#6b7280",
          heading: "#ffffff",
        },
        brand: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          green: "#10b981",
          amber: "#f59e0b",
        },
        cyber: {
          cyan: "#00f0ff",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          pink: "#ec4899",
          green: "#00ff88",
          dark: "#030712",
          darker: "#010409",
          glass: "rgba(6, 12, 34, 0.75)",
          border: "rgba(0, 240, 255, 0.15)",
          borderHover: "rgba(0, 240, 255, 0.4)",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          medium: "rgba(255, 255, 255, 0.1)",
          cyber: "rgba(0, 240, 255, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        display: ["var(--font-bebas)", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #00f0ff 0%, #3b82f6 50%, #8b5cf6 100%)",
        "gradient-alt": "linear-gradient(135deg, #00ff88 0%, #00f0ff 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(139, 92, 246, 0.08) 100%)",
        "gradient-cyber": "linear-gradient(180deg, rgba(3, 7, 18, 0.4) 0%, rgba(3, 7, 18, 0.85) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 240, 255, 0.18)",
        "glow-lg": "0 0 60px rgba(0, 240, 255, 0.35)",
        "glow-cyan": "0 0 25px rgba(0, 240, 255, 0.4)",
        "glow-purple": "0 0 25px rgba(139, 92, 246, 0.4)",
        card: "0 8px 32px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-delayed-4": "float 6s ease-in-out 4s infinite",
        pulseFast: "pulse 2s ease-in-out infinite",
        scrollWheel: "scrollWheel 2s ease-in-out infinite",
        orb1: "orbFloat1 20s ease-in-out infinite",
        orb2: "orbFloat2 25s ease-in-out infinite",
        orb3: "orbFloat3 18s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        marquee: "marquee 32s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        scrollWheel: {
          "0%": { opacity: "1", transform: "translateX(-50%) translateY(0)" },
          "100%": { opacity: "0", transform: "translateX(-50%) translateY(14px)" },
        },
        orbFloat1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-60px, 80px) scale(1.1)" },
          "66%": { transform: "translate(40px, -40px) scale(0.9)" },
        },
        orbFloat2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(80px, -60px) scale(1.15)" },
          "66%": { transform: "translate(-40px, 60px) scale(0.85)" },
        },
        orbFloat3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-80px, -60px) scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
