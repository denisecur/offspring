import { getToken } from "../../helpers";
import { API } from "../../constant";

export const fetchUserGrades = async () => {
  const url = `${API}/noten?populate=*`;
  const token = getToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Daten");
  }

  const data = await response.json();

  return data;
};

export const addUserGrade = async (gradeData) => {
  const url = `${API}/noten?populate=*`;
  const token = getToken();
  console.log({gradeData});

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        wert: gradeData.wert,
        art: gradeData.art,
        datum: gradeData.datum,
        ausbildungsfach: {
          id: gradeData.ausbildungsfach,  // Hier wird die Fach-ID übermittelt
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Hinzufügen der Note");
  }

  const data = await response.json();
  return data;
};



export const fetchGradesByFach = async (fachId) => {
  const token = getToken();
  const response = await fetch(
    `${API}/noten?populate=ausbildungfach.fachrichtung`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Noten");
  }

  const data = await response.json();
  const grades = data.ausbildung.noten.filter(
    (note) => note.ausbildungsfach && note.ausbildungsfach.id === fachId
  );
  return grades;
};


