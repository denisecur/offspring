import { createTheme } from "@mui/material/styles";

const getActiveThemeColors = () => {
  const theme = localStorage.getItem("theme") || "cp1";

  if (theme === "cp1") {
    return {
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
    };
  } else if (theme === "cp2") {
    return {
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
    };
  }
  else if (theme === "basic") {
    return {
      primary: "#00ff00", // Grün (Bash typische Schriftfarbe)
      secondary: "#008000", // Dunkleres Grün für Kontraste
      accent: "#00ffff", // Cyan für Highlights
      neutral: "#101010", // Dunkles Grau/Schwarz als Hintergrund
      "base-100": "#000000", // Tiefschwarz für echten Terminal-Look
      info: "#ffffff", // Weiß für helle Infos
      success: "#33ff33", // Helles Grün für Erfolgsmeldungen
      warning: "#ffff00", // Gelb für Warnungen
      error: "#ff0000", // Rot für Fehler
      text: "#00ff00", // Typische grüne Bash-Schrift
    };
  }
  return {
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
  };
};

const getThemeColors = () => {
  const activeThemeColors = getActiveThemeColors();

  return createTheme({
    palette: {
      primary: {
        main: activeThemeColors.primary,
        contrastText: "#ffffff",
      },
      secondary: {
        main: activeThemeColors.secondary,
        contrastText: "#000000",
      },
      accent: {
        main: activeThemeColors.accent,
      },
      background: {
        default: activeThemeColors["base-100"],
        paper: activeThemeColors.neutral,
      },
      text: {
        primary: activeThemeColors.text,
        secondary: activeThemeColors.secondary,
      },
      info: {
        main: activeThemeColors.info,
      },
      success: {
        main: activeThemeColors.success,
      },
      warning: {
        main: activeThemeColors.warning,
      },
      error: {
        main: activeThemeColors.error,
      },
    },
  });
};

export default getThemeColors;
