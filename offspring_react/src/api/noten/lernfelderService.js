import { getToken } from '../../helpers'; 
import { API } from '../../constant';

export const fetchLernfelder = async () => {
  const url = `${API}/lernfelder?populate=*`;
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

  const res = await response.json();
  //console.log("res.data: " + res.data)
  return res.data;
};
