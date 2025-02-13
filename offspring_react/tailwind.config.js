module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/config/theme.js"], 
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        neutral: "var(--color-neutral)",
        "base-100": "var(--color-base-100)",
        info: "var(--color-info)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        text: "var(--color-text)",
      },
    },
  },
  daisyui: {
    //themes: ["mytheme"], // 🔥 Verhindert, dass DaisyUI seine eigenen Themes lädt!
  },
};
