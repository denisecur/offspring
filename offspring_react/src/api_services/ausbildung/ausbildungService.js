// src/api_services/ausbildungen/ausbildungService.js
import { getToken } from "../../helpers";
import { API } from "../../constant";

/**
 * Lädt alle Ausbildungen inklusive Azubis (over ?populate=azubis).
 *
 * Beispiel:
 * GET {{API}}/ausbildungen?populate=azubis
 */
export const fetchAusbildungen = async () => {
  // Deine API-Base-URL ist in API hinterlegt:
  const url = `${API}/ausbildungen?populate=azubis`;

  // Aus helpers die Token-Funktion
  const token = getToken();


  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Logge den Statuscode zur Diagnose
    console.error("[fetchAusbildungen] -> Fehler! status:", response.status);
    throw new Error(`Fehler beim Abrufen der Ausbildungen (Status: ${response.status})`);
  }

  // JSON parsen
  const data = await response.json();
  
  // data hat in Strapi-Format idR. { data: [ ... ] }
  return data;
};
