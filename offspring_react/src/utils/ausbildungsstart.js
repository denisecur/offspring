// src/utils/ausbildungsstart.js

export function berechneKlassenAusNoten(alleNoten) {
  
    // 1) Noten nach userId gruppieren
    const notenProUser = alleNoten.reduce((acc, note) => {
      const userId = note.owner.id;
      if (!userId) {
        console.warn("note.owner.id: " + note.owner.id);
        console.warn("[berechneKlassenAusNoten] Keine userId in note:", note);
        return acc;
      }
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(note);
      return acc;
    }, {});
  
    // 2) Älteste Note pro User ermitteln
    const userStartData = Object.entries(notenProUser).map(([userId, noten]) => {
      const earliestNote = noten.reduce((earliest, current) =>
        new Date(current.datum) < new Date(earliest.datum) ? current : earliest
      );
      
      // Hier ziehst du den username + die Ausbildungsrichtung:
      const username = earliestNote.user?.username || `User#${userId}`;
      // note.user.ausbildung.name:
      const ausbildung = earliestNote.user?.ausbildung?.name || "Unbekannte Ausbildung";
  
      return {
        userId,
        username,
        ausbildung,
        startdatum: new Date(earliestNote.datum),
      };
    });
  
    // 3) Nach Jahr und Ausbildungsrichtung (Name) gruppieren
    //    => { [year]: { [ausbildungName]: [{ userId, username }, ...] } }
    const klassenObj = userStartData.reduce((jahresAcc, userObj) => {
      const { userId, username, ausbildung, startdatum } = userObj;
      const year = startdatum.getFullYear();
  
      // Falls es dieses Jahr noch nicht gibt, lege ein leeres Objekt an
      if (!jahresAcc[year]) {
        jahresAcc[year] = {};
      }
      // Falls es diese Ausbildung noch nicht gibt, lege ein leeres Array an
      if (!jahresAcc[year][ausbildung]) {
        jahresAcc[year][ausbildung] = [];
      }
  
      // Push das User-Objekt { userId, username } in die richtige Stelle
      jahresAcc[year][ausbildung].push({ userId, username });
      return jahresAcc;
    }, {});
  
    return klassenObj;
  }
  