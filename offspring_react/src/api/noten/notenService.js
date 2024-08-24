import { getToken } from "../../helpers";
import { API } from "../../constant";

// Funktion zum Abrufen aller Noten eines Benutzers
export const fetchUserGrades = async () => {
  const url = `${API}/noten?populate=*`; // API-Endpunkt, um Noten abzurufen
  const token = getToken(); // Token vom Helper abrufen
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Daten: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Noten:", error);
    throw error;
  }
};

// Funktion zum Hinzufügen einer neuen Note für den Benutzer
export const addUserGrade = async (gradeData) => {
  const url = `${API}/noten`; // Angepasster API-Endpunkt für Noten
  const token = getToken();
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { // Anpassung für Strapi-Format
          datum: gradeData.datum,
          wert: gradeData.wert,
          art: gradeData.art,
          gewichtung: gradeData.gewichtung,
          ausbildungsfach: gradeData.ausbildungsfach, // Hier wird die ID des Ausbildungsfachs erwartet
          lernfeld: gradeData.lernfeld, // Optionales Feld, falls erforderlich
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Hinzufügen der Note: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Note:", error);
    throw error;
  }
};

// Funktion zum Abrufen der Noten nach Ausbildungsfach
export const fetchGradesByFach = async (fachId) => {
  const url = `${API}/noten?populate=ausbildungsfach&filters[ausbildungsfach][id][$eq]=${fachId}`; // Filter nach Ausbildungsfach-ID
  const token = getToken();
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Noten nach Fach: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Extrahiere die relevanten Noten aus der API-Antwort
    const grades = data.data.map(item => item.attributes); // Korrigierte Zuordnung für Strapi 4
    return grades;
  } catch (error) {
    console.error("Fehler beim Abrufen der Noten nach Fach:", error);
    throw error;
  }
};

// Funktion zur Berechnung des Durchschnitts
export const calculateDurchschnitt = async (fachId) => {
  try {
    const grades = await fetchGradesByFach(fachId);
    if (grades.length === 0) return 0;

    const totalWeightedGrades = grades.reduce(
      (acc, grade) => acc + grade.wert * grade.gewichtung,
      0
    );
    const totalWeights = grades.reduce(
      (acc, grade) => acc + grade.gewichtung,
      0
    );

    return totalWeights ? (totalWeightedGrades / totalWeights).toFixed(2) : 0;
  } catch (error) {
    console.error("Fehler beim Berechnen des Durchschnitts:", error);
    return 0;
  }
};
