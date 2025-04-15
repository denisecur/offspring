// src/components/ThemeSwitcher.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { themes } from "../config/theme";

const ThemeSwitcher = () => {
  const { themeName, setThemeName } = useContext(ThemeContext);

  const handleChange = (e) => {
    const newTheme = e.target.value;
    setThemeName(newTheme);
  };

  return (
    <select
      value={themeName}
      onChange={handleChange}
      className="p-2 border border-gray-500 bg-gray-200 text-black rounded"
    >
      {Object.keys(themes).map((themeKey) => (
        <option key={themeKey} value={themeKey}>
          {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default ThemeSwitcher;
