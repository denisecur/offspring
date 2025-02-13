import React, { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "cp1");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("themeChange")); // 🔥 Event auslösen, damit MUI das Theme neu lädt
  }, [theme]);

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="p-2 border border-gray-500 bg-gray-800 text-white rounded"
    >
      <option value="cp1">CP1</option>
      <option value="cp2">CP2</option>
      <option value="basic">BASIC</option>
    </select>
  );
};

export default ThemeSwitcher;
