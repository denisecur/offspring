import { getToken } from "../../helpers";
import { API } from "../../constant";

export const fetchUserGrades = async () => {
  const url = `${API}/users/me?populate=ausbildung.noten,ausbildung.noten.ausbildungsfach,ausbildung.noten.lernfeld`;
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
  const url = `${API}/user/note`;
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      note: {
        datum: gradeData.datum,
        wert: gradeData.wert,
        art: gradeData.art,
        gewichtung: gradeData.gewichtung,
        ausbildungsfach: gradeData.ausbildungsfach,
        lernfeld: gradeData.lernfeld,
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
    `${API}/users/me?populate=ausbildung.noten,ausbildung.noten.ausbildungsfach,ausbildung.noten.lernfeld`,
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
    console.error("Error calculating average:", error);
    return 0;
  }
};
