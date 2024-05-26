import { getToken } from '../helpers'; 
import { API } from '../constant';

export const fetchUserGrades = async () => {
  const url = `${API}/users/me?populate=ausbildung.noten,ausbildung.noten.ausbildungsfach,ausbildung.noten.lernfeld`;
  const token = getToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Abrufen der Daten');
  }

  const data = await response.json();
  return data;
};

export const addUserGrade = async (gradeData) => {
  const url = `${API}/user/me`; // stammt aus benutzerdefinierter route (siehe backend/src/api/user-permissions/...strapi-server.js und routes.json)
  const token = getToken();
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note: gradeData }),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Hinzufügen der Note');
  }

  const data = await response.json();
  return data;
};
