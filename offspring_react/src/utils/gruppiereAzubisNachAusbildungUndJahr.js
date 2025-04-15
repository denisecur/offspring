// src/utils/gruppiereAzubisNachAusbildungUndJahr.js

/**
 * Diese Funktion nimmt die API-Response von /ausbildungen?populate=azubis
 * und baut ein verschachteltes Objekt:
 *
 * {
 *   [year]: {
 *     [ausbildungsName]: [
 *       { id, username, createdAt },
 *       ...
 *     ]
 *   },
 *   ...
 * }
 *
 * Dabei holen wir:
 * - das Jahr aus azubi.attributes.createdAt
 * - den Ausbildungsnamen aus ausbildungObj.attributes.name
 * - pro Azubi: { id, username, createdAt }
 */

export function gruppiereAzubisNachAusbildungUndJahr(ausbildungResponse) {
    console.log("[gruppiereAzubisNachAusbildungUndJahr] START");
    console.log("[gruppiereAzubisNachAusbildungUndJahr] Eingehende Daten:", ausbildungResponse);
  
    // leeres Objekt für das Ergebnis
    const result = {};
  
    // Prüfen, ob data vorhanden ist
    if (!ausbildungResponse || !ausbildungResponse.data) {
      console.warn("[gruppiereAzubisNachAusbildungUndJahr] Keine oder ungültige API-Daten:", ausbildungResponse);
      return result;
    }
  
    // Schleife über alle Ausbildungseinträge
    console.log("[gruppiereAzubisNachAusbildungUndJahr] #Ausbildungen:", ausbildungResponse.data.length);
  
    ausbildungResponse.data.forEach((ausbildungObj, idx) => {
      console.log(`[#${idx}] ausbildungObj:`, ausbildungObj);
  
      // Name der Ausbildung
      const ausbildungName = ausbildungObj.attributes?.name || "Unbekannte Ausbildung";
      console.log(`[#${idx}] -> ausbildungName:`, ausbildungName);
  
      // Azubis-Array -> ausbildungObj.attributes.azubis.data
      const azubis = ausbildungObj.attributes?.azubis?.data || [];
      console.log(`[#${idx}] -> #Azubis in dieser Ausbildung:`, azubis.length);
  
      // Jetzt durch alle Azubis iterieren
      azubis.forEach((azubi, azubiIdx) => {
        console.log(`[#${idx}]   [Azubi#${azubiIdx}]`, azubi);
  
        const azubiId = azubi.id;
        const username = azubi.attributes?.username || `User#${azubiId}`;
        const createdAt = azubi.attributes?.createdAt;
        console.log(`[#${idx}]   [Azubi#${azubiIdx}] -> username: ${username}, createdAt: ${createdAt}, id: ${azubiId}`);
  
        if (!createdAt) {
          console.warn(`[Azubi#${azubiIdx}] kein createdAt, überspringe…`);
          return;
        }
  
        // Jahr bestimmen
        const year = new Date(createdAt).getFullYear();
        console.log(`[#${idx}]   [Azubi#${azubiIdx}] -> year=${year}`);
  
        // 1) Falls dieses Jahr im result noch nicht vorhanden ist, anlegen
        if (!result[year]) {
          console.log(`[#${idx}]   -> Neues Jahr: ${year}`);
          result[year] = {};
        }
  
        // 2) Dann checken, ob wir in diesem Jahr die Ausbildung schon haben
        if (!result[year][ausbildungName]) {
          console.log(`[#${idx}]   -> Neue Ausbildung '${ausbildungName}' in Jahr ${year}`);
          result[year][ausbildungName] = [];
        }
  
        // 3) Den Azubi ins Array pushen
        result[year][ausbildungName].push({
          id: azubiId,
          username,
          createdAt,
        });
      });
    });
  
    console.log("[gruppiereAzubisNachAusbildungUndJahr] Ergebnis:", result);
    console.log("[gruppiereAzubisNachAusbildungUndJahr] ENDE");
    return result;
  }
  