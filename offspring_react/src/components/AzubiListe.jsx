// AzubiListe.jsx
import React, { useState } from 'react';

const AzubiListe = ({ azubis, onSelectAzubi }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fachrichtungFilter, setFachrichtungFilter] = useState([]);

  // Beispielhafte Fachrichtungen
  const fachrichtungen = ['Büromanagement', 'Versicherungen und Finanzanlagen']; //TODO über api call: ausbildung

  // Handler für Fachrichtungsfilter
  const handleFachrichtungToggle = (fachrichtung) => {
    setFachrichtungFilter((prev) =>
      prev.includes(fachrichtung)
        ? prev.filter((f) => f !== fachrichtung)
        : [...prev, fachrichtung]
    );
  };

  // Gefilterte und gefilterte Azubi-Liste
  const filteredAzubis = azubis.filter((azubi) => {
    const fullName = `${azubi.username}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const matchesFachrichtung =
      fachrichtungFilter.length === 0 ||
      fachrichtungFilter.includes(azubi.fachrichtung);

    return matchesSearch && matchesFachrichtung;
  });

  return (
    <div className="azubi-liste">
      <h2>Liste aller Auszubildenden</h2>

      {/* Suchleiste */}
      <input
        type="text"
        placeholder="Suche nach Name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Fachrichtungsfilter */}
      <div className="filter">
        {fachrichtungen.map((fachrichtung) => (
          <label key={fachrichtung}>
            <input
              type="checkbox"
              checked={fachrichtungFilter.includes(fachrichtung)}
              onChange={() => handleFachrichtungToggle(fachrichtung)}
            />
            {fachrichtung}
          </label>
        ))}
      </div>

      {/* Azubi-Liste */}
      <ul>
        {filteredAzubis.map((azubi) => (
          <li key={azubi.id} onClick={() => onSelectAzubi(azubi)}>
     
            {/* Vor- und Nachname */}
            <span>{`${azubi.username}`}</span>

        
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AzubiListe;
