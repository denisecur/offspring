// reportService.js
import { format } from "date-fns";

// Funktion zum Abrufen der Berichtshefte
export const fetchReports = async (token) => {
  const response = await fetch("http://localhost:1337/api/berichtshefte", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Berichtshefte");
  }

  // Gibt die JSON-Daten zurück
  return response.json();
};

// Funktion zum Hochladen eines Berichtsheftes
export const uploadReport = async (token, file, reportDate) => {
  const formData = new FormData();
  const wocheVom = format(reportDate, "yyyy-MM-dd");
  formData.append("data", JSON.stringify({ woche_vom: wocheVom }));
  formData.append("files.pdf", file);

  const response = await fetch("http://localhost:1337/api/berichtshefte", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message || "Upload fehlgeschlagen");
  }

  return response.json();
};
