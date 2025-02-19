// Beispiel: berichtshefteService.js
import { format, getISOWeek } from "date-fns";

export const uploadReport = async (token, file, reportDate) => {
  const formData = new FormData();
  const wocheVom = format(reportDate, "yyyy-MM-dd");
  const calendarWeek = getISOWeek(reportDate);
  
  // Verwende den korrekten Schlüssel "kalenderwoche"
  const jsonData = JSON.stringify({
    kalenderwoche: calendarWeek,
    woche_vom: wocheVom
  });
  
  console.log("Sende folgende Daten an Strapi:", jsonData);
  
  formData.append("data", jsonData);
  formData.append("files.pdf", file);

  const response = await fetch("http://localhost:1337/api/berichtshefte?populate=pdf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Fehler in uploadReport:", errorData);
    throw new Error(errorData.error.message || "Upload fehlgeschlagen");
  }

  const result = await response.json();
  console.log("Upload Response:", result);
  return result;
};

export const fetchReports = async (token) => {
  const response = await fetch("http://localhost:1337/api/berichtshefte?populate=pdf", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Berichtshefte");
  }
  return response.json();
};
