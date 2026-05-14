/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#eceef5",
          200: "#d6d9e6",
          300: "#aab0c5",
          400: "#7a82a1",
          500: "#535b7d",
          600: "#3b4263",
          700: "#2a304b",
          800: "#1c2138",
          900: "#11142a",
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bfd1ff",
          300: "#94b1ff",
          400: "#6987ff",
          500: "#4763ff",
          600: "#2f43eb",
          700: "#2433c0",
          800: "#1f2d99",
          900: "#1d2a7a",
        },
        accent: {
          400: "#ffb547",
          500: "#ff9b1c",
          600: "#f37e00",
        },
        rose: { 500: "#ff5470" },
        mint: { 500: "#22c993" },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,20,42,.04), 0 8px 24px -8px rgba(17,20,42,.10)",
        glow: "0 10px 40px -10px rgba(71,99,255,.55)",
      },
      backgroundImage: {
        "grid-faint":
          "radial-gradient(circle at 1px 1px, rgba(17,20,42,0.06) 1px, transparent 0)",
      },
      animation: {
        "pop-in": "popIn .35s cubic-bezier(.175,.885,.32,1.275)",
        shake: "shake .45s cubic-bezier(.36,.07,.19,.97)",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(.7)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shake: {
          "10%,90%": { transform: "translate3d(-1px,0,0)" },
          "20%,80%": { transform: "translate3d(2px,0,0)" },
          "30%,50%,70%": { transform: "translate3d(-5px,0,0)" },
          "40%,60%": { transform: "translate3d(5px,0,0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
