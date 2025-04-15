// utils/getKlassenAusNoten.js
import { fetchUserGrades } from "../api_services/noten/notenService";

export async function getKlassenAusNoten() {
  try {
    console.log("[getKlassenAusNoten] Start fetching user grades…");
    const { data: alleNoten } = await fetchUserGrades();
    console.log("[getKlassenAusNoten] Received data:", alleNoten);

    console.log("[getKlassenAusNoten] Grouping notes by userId…");
    const notenProUser = alleNoten.reduce((acc, note) => {
      // Falls deine Daten anders strukturiert sind, hier ggf. anpassen (z. B. note.user._id)
      const userId = note.owner.id; 
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(note);
      return acc;
    }, {});
    console.log("[getKlassenAusNoten] notenProUser:", notenProUser);

    console.log("[getKlassenAusNoten] Finding earliest (oldest) note per user…");
    const userStartDates = Object.entries(notenProUser).map(([userId, noten]) => {
      const earliestNote = noten.reduce((earliest, current) => {
        return new Date(current.datum) < new Date(earliest.datum) ? current : earliest;
      });
      return {
        userId,
        startdatum: new Date(earliestNote.datum),
      };
    });
    console.log("[getKlassenAusNoten] userStartDates:", userStartDates);

    console.log("[getKlassenAusNoten] Grouping by year of earliest note…");
    const klassenObj = userStartDates.reduce((acc, { userId, startdatum }) => {
      const year = startdatum.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(userId); 
      return acc;
    }, {});
    console.log("[getKlassenAusNoten] klassenObj:", klassenObj);

    console.log("[getKlassenAusNoten] Returning classes…");
    return klassenObj; 
  } catch (error) {
    console.error("[getKlassenAusNoten] Error:", error);
    throw error;
  }
}
