// src/context/ThemeContext.jsx
import React, { createContext, useState, useLayoutEffect } from "react";
import getThemeColors, { themes } from "../config/theme"; // Stelle sicher, dass getThemeColors ein gültiges MUI-Theme-Objekt zurückgibt

// Lese den gespeicherten Theme-Wert oder nutze "basicLight" als Standard
const savedTheme = localStorage.getItem("theme") || "basicLight";

// Erstelle den Context mit initialen Werten
export const ThemeContext = createContext({
  themeName: savedTheme,
  setThemeName: () => {},
  muiTheme: getThemeColors(savedTheme),
});

export const ThemeProviderCustom = ({ children }) => {
  const [themeName, setThemeName] = useState(savedTheme);
  const [muiTheme, setMuiTheme] = useState(getThemeColors(savedTheme));

  useLayoutEffect(() => {
    // Speichere den aktuellen Theme-Wert in localStorage
    localStorage.setItem("theme", themeName);

    // Setze das data-theme-Attribut am <html>-Element
    document.documentElement.setAttribute("data-theme", themeName);

    // Hole die aktiven Farbwerte aus deiner themes-Konfiguration
    const activeThemeColors = themes[themeName] || themes["basicLight"];
    //console.log("activeThemeColors for", themeName, ":", activeThemeColors);

    // Setze die CSS-Variablen im Dokument (mit "important", um Überschreibungen zu verhindern)
    Object.entries(activeThemeColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value, "important");
    });

    // Aktualisiere das MUI-Theme anhand des aktuellen themeName
    const newMuiTheme = getThemeColors(themeName);
    //console.log("Updating muiTheme for:", themeName, newMuiTheme);
    setMuiTheme(newMuiTheme);

    // Überprüfe, ob das data-theme-Attribut korrekt gesetzt wurde
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme !== themeName) {
      console.warn("WARNUNG: data-theme stimmt nicht überein!", { currentTheme, themeName });
      document.documentElement.setAttribute("data-theme", themeName);
    }
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, muiTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
