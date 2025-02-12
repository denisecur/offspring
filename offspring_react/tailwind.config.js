module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{html,js}",
    "./components/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Standardfarben (können überschrieben werden)
        primary: "#2563eb",
        secondary: "#f472b6",
        accent: "#34d399",
        neutral: "#5eead4",
        base100: "#ffffff",
        info: "#fde047",
        success: "#4ade80",
        warning: "#fb923c",
        error: "#ef4444",
        t1: "#453edb",
        allgemeinFach: "#8492a6",
        fachlichFach: "#7e5bef",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  daisyui: {
    themes: [
      {
        cp1: {
          primary: "#ff2a6d",
          secondary: "#d1f7ff",
          accent: "#05d9e8",
          neutral: "#005678",
          "base-100": "#01012b",
          info: "#fde047",
          success: "#4ade80",
          warning: "#fb923c",
          error: "#ef4444",
        },
        cp2: {
          primary: "#7700a6",
          secondary: "#fe00fe",
          accent: "#defe47",
          neutral: "#00b3fe",
          "base-100": "#0016ee",
          info: "#fde047",
          success: "#4ade80",
          warning: "#fb923c",
          error: "#ef4444",
        },
        // Weitere Themes hier hinzufügen
      },
    ],
  },
  plugins: [require("daisyui")],
};