// src/api_services/noten/ausbildungsfaecherService.js
import { getToken } from '../../helpers';
import { API } from '../../constant';

export const fetchAusbildungsDetails = async (ausbildungsrichtung) => {
  const url = `${API}/ausbildungen?populate=ausbildungsfaches, leistungsnachweise`;
  const token = getToken();

  try {
    // Starte Abruf von Ausbildungsdetails
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Ausbildungsdetails");
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error("Keine Ausbildungsdetails gefunden");
    }

    let faecher = [];
    let leistungsnachweise = [];

    // Durchlaufe alle Ausbildungs-Einträge
    data.data.forEach((ausbildung, idx) => {
      if (!ausbildung.attributes) {
        console.warn(`Ausbildung an Index ${idx} hat keine attributes:`, ausbildung);
        return;
      }

      // Wenn ein Filter (ausbildungsrichtung) gesetzt ist, nur diese Ausbildung berücksichtigen
      if (ausbildungsrichtung && ausbildung.attributes.name !== ausbildungsrichtung) {
        return;
      }

      // Fächer extrahieren
      const faecherData = ausbildung.attributes.ausbildungsfaches;
      if (faecherData && Array.isArray(faecherData.data)) {
        const validFaecher = faecherData.data
          .map((fach, fachIdx) => {
            if (!fach.attributes) {
              console.warn(`Fach an Index ${fachIdx} in Ausbildung ${idx} hat keine attributes:`, fach);
              return null;
            }
            return {
              id: fach.id,
              name: fach.attributes.name,
              isFachlichesFach: fach.attributes.isFachlichesFach,
            };
          })
          .filter((fach) => fach !== null);
        faecher = faecher.concat(validFaecher);
      } else {
        console.warn(`Keine Fächer-Daten in Ausbildung an Index ${idx}:`, ausbildung);
      }

      // Leistungsnachweise extrahieren
      const lnData = ausbildung.attributes.leistungsnachweise;
      if (Array.isArray(lnData) && lnData.length > 0) {
        const validLeistungsnachweise = lnData.map((ln, lnIdx) => {
          if (!ln.id) {
            console.warn(`Leistungsnachweis an Index ${lnIdx} in Ausbildung ${idx} fehlt id:`, ln);
          }
          return {
            id: ln.id,
            art: ln.art,
            gewichtung: ln.gewichtung,
          };
        });
        leistungsnachweise = leistungsnachweise.concat(validLeistungsnachweise);
      } else {
        console.warn(`Keine Leistungsnachweise in Ausbildung an Index ${idx}:`, ausbildung);
      }
    });

    return { faecher, leistungsnachweise };
  } catch (error) {
    console.error("Fehler in fetchAusbildungsDetails:", error);
    throw error;
  }
};
