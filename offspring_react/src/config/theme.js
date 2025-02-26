import { createTheme } from "@mui/material/styles";

// 🔥 Definiere alle Themes zentral
export const themes = {
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
    text: "#ffffff",
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
    text: "#ffffff",
  },
  basicLight: {
    main: "#007bff",
    primary: "#1B2025",//"#007bff",
    secondary: "#151F30",// 
    accent: "#17a2b8",
    neutral: "#f8f9fa",
    "base-100": "#ffffff",
    info: "#17a2b8",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
    text: "#151F30",
  }
};

// ✅ Funktion zum Abrufen des Themes
const getThemeColors = (themeName = localStorage.getItem("theme") || "basicLight") => {
  const activeThemeColors = themes[themeName] || themes["basicLight"];

  // 🔥 CSS-Variablen für Tailwind setzen (damit sie sofort aktiv sind)
  Object.entries(activeThemeColors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });

  return createTheme({
    palette: {
      primary: { main: activeThemeColors.primary, contrastText: "#ffffff" },
      secondary: { main: activeThemeColors.secondary, contrastText: "#000000" },
      accent: { main: activeThemeColors.accent },
      background: {
        default: activeThemeColors["base-100"],
        paper: activeThemeColors.neutral,
      },
      text: {
        primary: activeThemeColors.text,
        secondary: activeThemeColors.secondary,
      },
      info: { main: activeThemeColors.info },
      success: { main: activeThemeColors.success },
      warning: { main: activeThemeColors.warning },
      error: { main: activeThemeColors.error },
    },
  });
};

export default getThemeColors;
