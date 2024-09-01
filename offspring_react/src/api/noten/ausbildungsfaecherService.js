import { getToken } from '../../helpers'; 
import { API } from '../../constant';

/**
 * Fetches the educational subjects from the API.
 * @returns {Promise<Object>} The data from the API response.
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

  return response.json(); // Return the data object
};

/**
 * Filters and maps the educational subjects based on the specified direction.
 * @param {string} ausbildungsrichtung - The direction of education (e.g., "Büromanagement").
 * @returns {Promise<Array>} The array of subjects with their IDs and names.
 */
export const getFaecherByAusbildungsrichtung = async (ausbildungsrichtung) => {
  const data = await fetchAusbildungsfaecher(); // Wait for the data
  return data.data // Assuming data.data contains the array
    .filter(item => item.attributes.name === ausbildungsrichtung)
    .flatMap(item => item.attributes.ausbildungsfaches.data.map(fach => ({
      id: fach.id,
      name: fach.attributes.name
    })));
};
