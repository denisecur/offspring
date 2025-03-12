// azubiService.js
import axios from 'axios';
import { getToken } from '../../helpers';

export const fetchAzubis = async () => {
  const API_URL = 'http://localhost:1337';
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/api/users?populate=ausbildung,Rollen.name&filters[Rollen][name][$eq]=azubi`, 
        {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
    );

    const azubis = response.data.map((user) => ({
      id: user?.id,
      username: user?.username,
      fachrichtung: user?.ausbildung?.name,
    }));
    return azubis;
  } catch (error) {
    console.error('Fehler beim Abrufen der Azubis:', error);
    throw error;
  }
};
