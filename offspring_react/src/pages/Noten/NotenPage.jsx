import React, { useState, useEffect } from "react";
import { fetchUserGrades, addUserGrade } from "/src/api/noten/notenService";

const NotenPage = () => {
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    datum: "",
    wert: "",
    art: "",
    gewichtung: "",
    ausbildungsfach: "",
    lernfeld: "",
  });

  // Lädt die Noten des Benutzers beim Laden der Komponente
  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchUserGrades();
        setGrades(data.data);
      } catch (err) {
        setError("Fehler beim Abrufen der Noten");
      }
    };
    loadGrades();
  }, []);

  // Handhabung der Änderung in Eingabefeldern
  const handleChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  // Fügt eine neue Note hinzu
  const handleAddGrade = async () => {
    try {
      const addedGrade = await addUserGrade(newGrade);
      setGrades([...grades, addedGrade.data]);
      setNewGrade({
        datum: "",
        wert: "",
        art: "",
        gewichtung: "",
        ausbildungsfach: "",
        //lernfeld: ''
      });
      setError("");
    } catch (err) {
      setError("Fehler beim Hinzufügen der Note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Notenverwaltung</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-4 py-6 sm:px-6 lg:px-8">
          {" "}
          {/*Größe von dotted border*/}
          <div className="px-8 py-6 sm:px-0">
            <div className="border-4 px-4 border-dashed border-gray-200 rounded-lg">
              <div className="flex justify-between mb-4 w-full">
                {/* Anzeige der Notenliste */}
                <h3>Alle Noten</h3>
                {grades.length === 0 ? (
                  <p>Keine Noten vorhanden</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Datum</th>
                        <th>Note</th>
                        <th>Art</th>
                        <th>Gewichtung</th>
                        <th>Fach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.datum}</td>
                          <td>
                            {grade.ausbildungsfach
                              ? grade.ausbildungsfach.name
                              : "Unbekannt"}
                          </td>
                          <td>{grade.wert}</td>
                          <td>{grade.art}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotenPage;

{
  /* Formular zum Hinzufügen einer neuen Note 
<div className="add-grade-form">
<h3>Neue Note hinzufügen</h3>
<input type="date" name="datum" value={newGrade.datum} onChange={handleChange} placeholder="Datum" />
<input type="number" name="wert" value={newGrade.wert} onChange={handleChange} placeholder="Note (z.B. 1.0)" />
<input type="text" name="art" value={newGrade.art} onChange={handleChange} placeholder="Art (z.B. Schulaufgabe)" />
<input type="number" name="gewichtung" value={newGrade.gewichtung} onChange={handleChange} placeholder="Gewichtung" />
<input type="text" name="ausbildungsfach" value={newGrade.ausbildungsfach} onChange={handleChange} placeholder="Ausbildungsfach" />
<input type="text" name="lernfeld" value={newGrade.lernfeld} onChange={handleChange} placeholder="Lernfeld" />
<button onClick={handleAddGrade}>Note hinzufügen</button>
</div> */
}
