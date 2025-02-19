import React from "react";
import { useTheme } from "@mui/material/styles";

const ColorPalette = () => {
  const theme = useTheme();

  return (
    <div
      className="my-6 p-6 rounded-lg border-4 shadow-lg"
      style={{
        borderColor: theme.palette.accent.main,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 0px 15px ${theme.palette.accent.main}`,
      }}
    >
      <h2
        className="text-lg font-bold mb-4 text-center"
        style={{ color: theme.palette.text.primary }}
      >
        🎨 Farbdemo des aktuellen Themes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Info Box */}
        <div
          className="p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.info.main,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">ℹ️ Info</p>
          <p>Hier sind wichtige Informationen.</p>
        </div>

        {/* Error Box */}
        <div
          className="p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">❌ Fehler</p>
          <p>Etwas ist schiefgelaufen!</p>
        </div>

        {/* Success Box */}
        <div
          className="p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.success.main,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">✅ Erfolg</p>
          <p>Die Aktion wurde erfolgreich durchgeführt.</p>
        </div>

        {/* Warning Box */}
        <div
          className="p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">⚠️ Warnung</p>
          <p>Bitte überprüfe deine Eingaben!</p>
        </div>

        {/* Primary Color */}
        <div
          className="p-4 text-center rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <p className="font-semibold">🔵 Primär</p>
          <p>Die Hauptfarbe der App.</p>
        </div>

        {/* Secondary Color */}
        <div
          className="p-4 text-center rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">🟣 Sekundär</p>
          <p>Die Akzentfarbe für Sekundäraktionen.</p>
        </div>

        {/* Accent Color */}
        <div
          className="p-4 text-center rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.accent.main,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">✨ Akzent</p>
          <p>Wird für Highlights und leuchtende Effekte genutzt.</p>
        </div>

        {/* Neutral Background */}
        <div
          className="p-4 text-center rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">⚫ Neutral</p>
          <p>Die Hintergrundfarbe der App.</p>
        </div>

        {/* Base-100 Background */}
        <div
          className="p-4 text-center rounded-lg shadow-md"
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <p className="font-semibold">⚪ Base-100</p>
          <p>Eine helle Farbe für Inhalte.</p>
        </div>

        {/* Text Color */}
        <div
          className="p-4 text-center rounded-lg shadow-md border"
          style={{
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.paper,
            borderColor: theme.palette.accent.main,
            boxShadow: `0px 0px 15px ${theme.palette.accent.main}`,
          }}
        >
          <p className="font-semibold">✍️ Textfarbe</p>
          <p>Dies ist die Standard-Textfarbe.</p>
        </div>

      </div>
    </div>
  );
};

export default ColorPalette;
