import React from 'react';

// Funktion zur Berechnung des Schuljahres im Format YYYY/YY
const getSchoolYear = (datum) => {
  const date = new Date(datum);
  const year = date.getFullYear();
  const month = date.getMonth();
  const startYear = month >= 8 ? year : year - 1;
  const endYear = (startYear + 1).toString().slice(2); // Nur die letzten zwei Ziffern des Endjahres
  return `${startYear}/${endYear}`;
};

// Funktion zur Berechnung des gewichteten Durchschnitts einer Notenliste
const calculateAverage = (grades) => {
  if (grades.length === 0) return " ";
  const totalWeightedSum = grades.reduce((sum, grade) => sum + grade.wert * grade.gewichtung, 0);
  const totalWeight = grades.reduce((sum, grade) => sum + grade.gewichtung, 0);
  return (totalWeightedSum / totalWeight).toFixed(2);
};

// Durchschnitt berechnen nach Fach und Schuljahr
const calculateAverageByFachAndSchuljahr = (grades, fachName, schuljahr) => {
  const filteredGrades = grades.filter(grade => 
    grade.ausbildungsfach.name === fachName && getSchoolYear(grade.datum) === schuljahr
  );
  return calculateAverage(filteredGrades);
};

// Durchschnitt pro Jahr (über alle Fächer)
const calculateAverageByYear = (grades, schuljahr) => {
  const filteredGrades = grades.filter(grade => getSchoolYear(grade.datum) === schuljahr);
  return calculateAverage(filteredGrades);
};

// Hauptkomponente zur Anzeige der Liste der Fächer mit Notendurchschnitten
const DurchschnittsListe = ({ grades }) => {
  // Dynamisch die Schuljahre aus den Noten ermitteln
  const schuljahrs = [...new Set(grades.map(grade => getSchoolYear(grade.datum)))];

  // Schuljahre nach dem ersten Jahr sortieren
  const sortedSchuljahrs = schuljahrs.sort((a, b) => {
    const yearA = parseInt(a.split('/')[0], 10);
    const yearB = parseInt(b.split('/')[0], 10);
    return yearA - yearB;
  });

  // Dynamisch alle Fächer aus den Noten ermitteln
  const fachs = [...new Set(grades.map(grade => grade.ausbildungsfach.name))];

  return (
    <table className="text-sm table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left font-semibold">Fach</th>
          {sortedSchuljahrs.map((schuljahr) => (
            <th key={schuljahr} className="px-4 py-2 text-left font-semibold">
               {schuljahr}
            </th>
          ))}
          <th className="px-4 py-2 text-left font-semibold">Fachdurchschnitt</th>
        </tr>
      </thead>
      <tbody>
        {fachs.map((fachName) => (
          <tr key={fachName} className="border-t border-gray-200">
            <td className="px-4 py-2 font-light">{fachName}</td>
            {sortedSchuljahrs.map((schuljahr) => (
              <td key={schuljahr} className="px-4 py-2 font-light">
                {calculateAverageByFachAndSchuljahr(grades, fachName, schuljahr)}
              </td>
            ))}
            {/* Fachdurchschnitt über alle Schuljahre hinweg */}
            <td className="px-4 py-2 font-light">
              {calculateAverage(grades.filter(grade => grade.ausbildungsfach.name === fachName))}
            </td>
          </tr>
        ))}
        {/* Durchschnitt für jedes Schuljahr (Jahresdurchschnitt) */}
        <tr className="border-t border-gray-200">
          <td className="px-4 py-2 font-semibold">Jahresdurchschnitt</td>
          {sortedSchuljahrs.map((schuljahr) => (
            <td key={schuljahr} className="px-4 py-2 font-semibold">
              {calculateAverageByYear(grades, schuljahr)}
            </td>
          ))}
          <td className="px-4 py-2"></td> {/* Leere Zelle für die letzte Spalte */}
        </tr>
      </tbody>
    </table>
  );
};

export default DurchschnittsListe;
