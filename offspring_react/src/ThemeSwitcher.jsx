import React from "react";

const ThemeSwitcher = () => {
  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <select onChange={(e) => changeTheme(e.target.value)}>
      <option value="cp1">CP1</option>
      <option value="cp2">CP2</option>
      {/* Weitere Themes hier hinzufügen */}
    </select>
  );
};

export default ThemeSwitcher;