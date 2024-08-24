import React, { useState, useEffect } from "react";
import { fetchUserGrades, addUserGrade, calculateDurchschnitt } from "/src/api/noten/notenService";

const NotenPage = () => {
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    datum: '',
    wert: '',
    art: '',
    gewichtung: '',
    ausbildungsfach: '',
    lernfeld: ''
  });
  const [error, setError] = useState('');
  const [average, setAverage] = useState(0);

  // Lädt die Noten des Benutzers beim Laden der Komponente
  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchUserGrades();
        setGrades(data.data);
      } catch (err) {
        setError('Fehler beim Abrufen der Noten');
      }
    };
    loadGrades();
  }, []);

  // Berechnet den Durchschnitt der Noten bei Änderung der Notenliste
  useEffect(() => {
    if (grades.length > 0) {
      const calculateAvg = async () => {
        const avg = await calculateDurchschnitt(grades.map(grade => grade.ausbildungsfach.id));
        setAverage(avg);
      };
      calculateAvg();
    }
  }, [grades]);

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
        datum: '',
        wert: '',
        art: '',
        gewichtung: '',
        ausbildungsfach: '',
        lernfeld: ''
      });
      setError('');
    } catch (err) {
      setError('Fehler beim Hinzufügen der Note');
    }
  };

  return (
    <div className="notenverwaltung-container">
      <h2>Notenverwaltung</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Anzeige des Durchschnitts */}
      <div className="average-display">
        <h3>Durchschnittsnote: {average}</h3>
      </div>

      {/* Formular zum Hinzufügen einer neuen Note */}
      <div className="add-grade-form">
        <h3>Neue Note hinzufügen</h3>
        <input type="date" name="datum" value={newGrade.datum} onChange={handleChange} placeholder="Datum" />
        <input type="number" name="wert" value={newGrade.wert} onChange={handleChange} placeholder="Note (z.B. 1.0)" />
        <input type="text" name="art" value={newGrade.art} onChange={handleChange} placeholder="Art (z.B. Schulaufgabe)" />
        <input type="number" name="gewichtung" value={newGrade.gewichtung} onChange={handleChange} placeholder="Gewichtung" />
        <input type="text" name="ausbildungsfach" value={newGrade.ausbildungsfach} onChange={handleChange} placeholder="Ausbildungsfach" />
        <input type="text" name="lernfeld" value={newGrade.lernfeld} onChange={handleChange} placeholder="Lernfeld" />
        <button onClick={handleAddGrade}>Note hinzufügen</button>
      </div>

      {/* Anzeige der Notenliste */}
      <div className="grades-list">
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
                <th>Lernfeld</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.datum}</td>
                  <td>{grade.wert}</td>
                  <td>{grade.art}</td>
                  <td>{grade.gewichtung}</td>
                  <td>{grade.ausbildungsfach ? grade.ausbildungsfach.name : 'Unbekannt'}</td>
                  <td>{grade.lernfeld || 'Unbekannt'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default NotenPage;
 