// api/noten/notenService.js
import { getToken } from '../../helpers'; 
import { API } from '../../constant';
export const fetchAusbildungsfaecher = async (ausbildungsrichtung) => {
  const url = `${API}/ausbildungen?filters[name][$eq]=${ausbildungsrichtung}&populate=ausbildungsfaches`; // Passe die Filterung auf die Ausbildungsrichtung an
  const token = getToken();
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Fächer');
    }

    const data = await response.json();
    // Extrahiere nur die Fächer aus der Antwort
    const faecher = data.data[0]?.attributes.ausbildungsfaches?.data.map(fach => ({
      id: fach.id,
      name: fach.attributes.name,
    })) || [];

    return faecher;
  } catch (error) {
    throw error;
  }
};

export const fetchAusbildungsDetails = async (ausbildungsrichtung) => {
  const url = `${API}/ausbildungen?filters[name][$eq]=${ausbildungsrichtung}&populate=ausbildungsfaches,leistungsnachweise`; // Fächer und Leistungsnachweise holen
  const token = getToken();
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Ausbildungsdetails');
    }

    const data = await response.json();
    
    const ausbildung = data.data[0]; // Erste Ausbildungsrichtung (passend zur Auswahl)
    
    const faecher = ausbildung.attributes.ausbildungsfaches.data.map(fach => ({
      id: fach.id,
      name: fach.attributes.name,
    }));

    const leistungsnachweise = ausbildung.attributes.leistungsnachweise.map(ln => ({
      id: ln.id,
      art: ln.art,
      gewichtung: ln.gewichtung,
    }));

    return { faecher, leistungsnachweise };
  } catch (error) {
    console.error('Fehler in fetchAusbildungsDetails:', error);
    throw error;
  }
};
