module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    colors: {
      "primary": "#2563eb",
      "secondary": "#f472b6",
      "accent": "#34d399",
      "neutral": "#5eead4",
      "base-100": "#ffffff",
      "info": "#fde047",
      "success": "#4ade80",
      "warning": "#fb923c",
      "error": "#ef4444",
      "t1": "#453edb",
      "allgemeinFach": "#8492a6",
      "fachlichFach": "#7e5bef"

    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2563eb",
          "secondary": "#f472b6",
          "accent": "#34d399",
          "neutral": "#5eead4",
          "base-100": "#ffffff",
          "info": "#fde047",
          "success": "#4ade80",
          "warning": "#fb923c",
          "error": "#ef4444",
          "t1": "#453edb",
          "allgemeinFach": "#8492a6",
          "fachlichFach": "#7e5bef"
        },
      },
    ],
  },
  plugins: [require("daisyui")],

}
