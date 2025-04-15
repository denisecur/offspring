// Beispiel: berichtshefteService.js
import { format, getISOWeek } from "date-fns";

export const uploadReport = async (token, file, reportDate) => {
  // Sicherstellen, dass reportDate ein gültiges Datum ist
  if (!(reportDate instanceof Date) || isNaN(reportDate)) {
    console.error("Ungültiges Datum:", reportDate);
    throw new Error("Ungültiges Datum für den Report-Upload.");
  }
  
  const wocheVom = format(reportDate, "yyyy-MM-dd");
  const calendarWeek = getISOWeek(reportDate);
  
  const formData = new FormData();
  const jsonData = JSON.stringify({
    kalenderwoche: calendarWeek,
    woche_vom: wocheVom
  });
  
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
  return result;
};

export const fetchReports = async (token, azubiId = null) => {
  let url = "http://localhost:1337/api/berichtshefte?populate=owner,pdf";
  
  if (azubiId) {
    url += `&filters[owner][id][$eq]=${azubiId}`;
  }

  //// console.log("API-Request an:", url); // NEU: Prüfen, ob URL korrekt ist

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Berichtshefte");
  }
  
  const data = await response.json();
  //// console.log("Erhaltene Daten:", data); // NEU: Prüfen, welche Daten zurückkommen
  return data;
};
