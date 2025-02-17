// berichtshefteService.js
import { format, getISOWeek } from "date-fns";

export const fetchReports = async (token) => {
  const response = await fetch("http://localhost:1337/api/berichtshefte", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Berichtshefte");
  }
  return response.json();
};

export const uploadReport = async (token, file, reportDate) => {
  const formData = new FormData();
  const wocheVom = format(reportDate, "yyyy-MM-dd");
  const calendarWeek = getISOWeek(reportDate); // Berechne die Kalenderwoche
  // Sende sowohl das Datum als auch die KW an Strapi:
  formData.append("data", JSON.stringify({ woche_vom: wocheVom, kw: calendarWeek }));
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
