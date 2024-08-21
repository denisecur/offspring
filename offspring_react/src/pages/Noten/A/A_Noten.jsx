import React, { useState, useEffect } from 'react';
import AddNote from './AddNote';
import { fetchUserGrades } from '../../../api/noten/notenService';
import NotenList from '../NotenList';
import Kennzahlen from '../Kennzahlen';

const A_Noten = () => {
  const [grades, setGrades] = useState([]);
  const [average, setAverage] = useState(null);
  const [fachId, setFachId] = useState(null);

  const fetchGrades = async () => {
    try {
      const data = await fetchUserGrades(); // Annahme: fetchUserGrades liefert die API-Antwort
      console.log("API-Daten:", JSON.stringify(data)); // Debug-Ausgabe

      // Extrahiere Noten aus den Daten
      const noten = data.data.map(item => ({
        id: item.id,
        datum: item.attributes.datum,
        wert: item.attributes.wert,
        art: item.attributes.art,
        gewichtung: item.attributes.gewichtung,
        ausbildungsfach: {
          id: item.attributes.ausbildungsfach.data.id,
          name: item.attributes.ausbildungsfach.data.attributes.name,
          fachrichtung: item.attributes.ausbildungsfach.data.attributes.fachrichtung
        }
      }));
      console.log("Extrahierte Noten:", noten); // Debug-Ausgabe
      setGrades(noten);
    } catch (error) {
      console.error("Fehler beim Abrufen der Noten:", error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleCalculateAverage = (id) => {
    // Implementiere die Durchschnittsberechnung basierend auf der Fach-ID
    const filteredGrades = grades.filter(grade => grade.ausbildungsfach.id === id);
    const avg = calculateDurchschnitt(filteredGrades);
    setAverage(avg);
  };

  return (
    <div>
       <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Notenverwaltung</h1>
        </div>
      </header>
      <main>
        <div className="max-w-10xl py-6 sm:px-10 lg:px-2"> { /* hier inneren weißen kasten anpassen breite */}
          <div className="px-8 py-6 sm:px-8">
            <h2>Note hinzufügen</h2>
            <div className="border-4 border-dashed border-gray-200 rounded-lg">
              <div className="flex justify-between mb-4 w-full">
                <div className="flex justify-between  w-full">
                  <AddNote/>
                </div>

                </div>
              </div>
          </div>
        </div>
      </main>

      <h1>Notenverwaltung</h1>

      <h1>Alle Noten</h1>
      <ul>
        {grades.length > 0 ? (
          grades.map((grade) => (
            <li key={grade.id}>
              {grade.datum}: {grade.wert}  - {grade.art} ({grade.gewichtung}-fach) - Fachrichtung: {grade.ausbildungsfach.fachrichtung} Fach: {grade.ausbildungsfach.name}
            </li>
          ))
        ) : (
          <p>Es sind noch keine Noten verfügbar.</p>
        )}
      </ul>

      <AddNote />
      <Kennzahlen noten={grades} />


    </div>
    </div>
  );
};

export default A_Noten;
