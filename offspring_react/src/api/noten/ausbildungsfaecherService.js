import { getToken } from '../../helpers'; 
import { API } from '../../constant';

/**
 * 
 * @returns "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Versicherungen und Finanzanlagen",
        "createdAt": "2024-09-01T10:07:31.082Z",
        "updatedAt": "2024-09-01T10:39:04.141Z",
        "publishedAt": "2024-09-01T10:11:23.336Z",
        "ausbildungsfaches": {
          "data": [
            {
              "id": 7,
              "attributes": {
                "name": "Deutsch",
                "createdAt": "2024-09-01T10:20:12.762Z",
                "updatedAt": "2024-09-01T10:20:15.733Z",
                "publishedAt": "2024-09-01T10:20:15.730Z"
              }
            }, ...

            ich brauche aber nur id und name von der Abfrage.
 */
export const fetchAusbildungsfaecher = async () => {
  const url = `${API}/ausbildungen?populate=ausbildungsfaches`;
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


/**
 * ich will das Objekt so:
 *
 */

// import { getToken } from '../../helpers'; 
// import { API } from '../../constant';

// /**
//  * 
//  * @returns {Array} Array von Objekten mit "id" und "name"
//  */
// export const fetchAusbildungsfaecher = async () => {
//   const url = `${API}/ausbildungen?populate=ausbildungsfaches`;
//   const token = getToken();
//   const response = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Fehler beim Abrufen der Daten');
//   }

//   const data = await response.json();

//   // Extrahiert nur die benötigten Felder (id und name)
//   const ausbildungsfaecher = data.data.map(item => {
//     return item.attributes.ausbildungsfaches.data.map(fach => ({
//       id: fach.id,
//       name: fach.attributes.name
//     }));
//   }).flat();

//   return ausbildungsfaecher;
// };
