// src/api_services/noten/notenService.js

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
  return data; // { data: [ ... ] }
};

export const addUserGrade = async (gradeData) => {
  const url = `${API}/noten?populate=*`;
  const token = getToken();

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
          id: gradeData.ausbildungsfach,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Hinzufügen der Note" + {gradeData});  }

  const data = await response.json();
  return data; // { data: { ... } }
};

/**
 * Neue Funktion: Note aktualisieren (PUT)
 */
export const updateUserGrade = async (gradeId, updatedData) => {
  const url = `${API}/noten/${gradeId}?populate=*`;
  const token = getToken();

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        wert: updatedData.wert,
        art: updatedData.art,
        datum: updatedData.datum,
        ausbildungsfach: {
          id: updatedData.ausbildungsfach,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren der Note");
  }

  const data = await response.json();
  return data; // { data: { ... } }
};

/**
 * Neue Funktion: Note löschen (DELETE)
 */
export const deleteUserGrade = async (gradeId) => {
  const url = `${API}/noten/${gradeId}`;
  const token = getToken();

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen der Note");
  }

  const data = await response.json();
  return data; // { data: { ... } }
};
