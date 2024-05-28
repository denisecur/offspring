import { getToken } from '../../helpers'; 
import { API } from '../../constant';

export const fetchAusbildungsfaecher = async () => {
  const url = `${API}/ausbildungsfaecher?populate=*`;
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
  //console.log(data)
  
  return data;
};
