import React, { useEffect, useState } from 'react';
import { DATE_OPTIONS } from '../constant';
import { addUserGrade } from '../api/noten/notenService';

const ListView = ({ selectedFach, filteredGrades }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Lokale States für das Formular
  const [datum, setDatum] = useState('');
  const [wert, setWert] = useState('');
  const [art, setArt] = useState('');
  const [gewichtung, setGewichtung] = useState(1);
  const [lernfeld, setLernfeld] = useState('');

  // Wenn ein Fach ausgewählt wird, setze Standardwerte (z. B. das erste Lernfeld)
  useEffect(() => {
    if (selectedFach) {
      if (selectedFach.lernfelder && selectedFach.lernfelder.length > 0) {
        setLernfeld(selectedFach.lernfelder[0].name);
      }
    }
  }, [selectedFach]);

  // Passe die Gewichtung basierend auf der ausgewählten Art an
  const handleArtChange = (e) => {
    const value = e.target.value;
    setArt(value);
    let newGewichtung = 1;
    if (value === 'Schulaufgabe') {
      newGewichtung = 2;
    } else if (value === 'Stegreifaufgabe' || value === 'Muendliche Leistung') {
      newGewichtung = 0.5;
    }
    setGewichtung(newGewichtung);
  };

  // Formular absenden
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gradeData = {
        datum, // Stelle sicher, dass das Datum im Format "YYYY-MM-DD" vorliegt, ggf. musst du hier formatieren
        wert,
        art,
        gewichtung,
        ausbildungsfach: selectedFach.id,
        lernfeld: lernfeld ? selectedFach.lernfelder.find(lf => lf.name === lernfeld)?.id : null,
      };
      await addUserGrade(gradeData);
      alert('Note erfolgreich hinzugefügt');
      // Formular zurücksetzen
      setDatum('');
      setWert('');
      setArt('');
      setGewichtung(1);
      setLernfeld(selectedFach?.lernfelder[0]?.name || '');
      setIsModalOpen(false);
    } catch (error) {
      alert('Fehler beim Hinzufügen der Note');
    }
  };

  const displayedGrades = selectedFach 
    ? filteredGrades.filter(grade => grade.ausbildungsfach === selectedFach.name)
    : filteredGrades;

  return (
    <div className="p-4">
      {/* Button zum Öffnen des Modals */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        Note hinzufügen
      </button>

      {/* Tabelle der Noten */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Datum</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Wert</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Art</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Gewichtung</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Lernfeld</th>
          </tr>
        </thead>
        <tbody>
          {displayedGrades.map(grade => (
            <tr key={grade.id} className="even:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-gray-900">
                {new Date(grade.datum).toLocaleDateString('de-DE', DATE_OPTIONS)}
              </td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.wert}</td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.art}</td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.gewichtung}</td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.lernfeld}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal zur Noteneingabe */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          {/* Modal-Inhalt */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg z-10 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Neue Note hinzufügen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Datum */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Datum</label>
                <input 
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Wert */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Wert</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="6"
                  value={wert}
                  onChange={(e) => setWert(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Art */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Art</label>
                <select 
                  value={art}
                  onChange={handleArtChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Schulaufgabe">Schulaufgabe</option>
                  <option value="Kurzarbeit">Kurzarbeit</option>
                  <option value="Stegreifaufgabe">Stegreifaufgabe</option>
                  <option value="Muendliche Leistung">Muendliche Leistung</option>
                  <option value="Projekt">Projekt</option>
                  <option value="Praesentation">Praesentation</option>
                </select>
              </div>
              {/* Gewichtung */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gewichtung</label>
                <input 
                  type="number"
                  value={gewichtung}
                  readOnly
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {/* Ausbildungsfach */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ausbildungsfach</label>
                <input 
                  type="text"
                  value={selectedFach ? selectedFach.name : ''}
                  readOnly
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {/* Lernfeld */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Lernfeld</label>
                <select 
                  value={lernfeld}
                  onChange={(e) => setLernfeld(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {selectedFach && selectedFach.lernfelder.map(lf => (
                    <option key={lf.id} value={lf.name}>{lf.name}</option>
                  ))}
                </select>
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Note hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListView;
