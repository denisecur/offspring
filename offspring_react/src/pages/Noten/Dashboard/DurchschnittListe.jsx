import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

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
  if (grades.length === 0) return ' ';
  const totalWeightedSum = grades.reduce(
    (sum, grade) => sum + grade.wert * grade.gewichtung,
    0
  );
  const totalWeight = grades.reduce((sum, grade) => sum + grade.gewichtung, 0);
  return (totalWeightedSum / totalWeight).toFixed(2);
};

// Durchschnitt berechnen nach Fach und Schuljahr
const calculateAverageByFachAndSchuljahr = (grades, fachName, schuljahr) => {
  const filteredGrades = grades.filter(
    (grade) =>
      grade.ausbildungsfach.name === fachName &&
      getSchoolYear(grade.datum) === schuljahr
  );
  return calculateAverage(filteredGrades);
};

// Durchschnitt pro Jahr (über alle Fächer)
const calculateAverageByYear = (grades, schuljahr) => {
  const filteredGrades = grades.filter(
    (grade) => getSchoolYear(grade.datum) === schuljahr
  );
  return calculateAverage(filteredGrades);
};

// Hauptkomponente zur Anzeige der Liste der Fächer mit Notendurchschnitten
const DurchschnittsListe = ({ grades }) => {
  // Dynamisch die Schuljahre aus den Noten ermitteln
  const schuljahrs = [...new Set(grades.map((grade) => getSchoolYear(grade.datum)))];

  // Schuljahre nach dem ersten Jahr sortieren
  const sortedSchuljahrs = schuljahrs.sort((a, b) => {
    const yearA = parseInt(a.split('/')[0], 10);
    const yearB = parseInt(b.split('/')[0], 10);
    return yearA - yearB;
  });

  // Dynamisch alle Fächer aus den Noten ermitteln
  const fachs = [...new Set(grades.map((grade) => grade.ausbildungsfach.name))];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Durchschnittstabelle">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Fach</TableCell>
            {sortedSchuljahrs.map((schuljahr) => (
              <TableCell key={schuljahr} sx={{ fontWeight: 'bold' }}>
                {schuljahr}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 'bold' }}>Fachdurchschnitt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fachs.map((fachName) => (
            <TableRow key={fachName}>
              <TableCell component="th" scope="row">
                {fachName}
              </TableCell>
              {sortedSchuljahrs.map((schuljahr) => (
                <TableCell key={schuljahr}>
                  {calculateAverageByFachAndSchuljahr(grades, fachName, schuljahr)}
                </TableCell>
              ))}
              {/* Fachdurchschnitt über alle Schuljahre hinweg */}
              <TableCell>
                {calculateAverage(
                  grades.filter((grade) => grade.ausbildungsfach.name === fachName)
                )}
              </TableCell>
            </TableRow>
          ))}
          {/* Durchschnitt für jedes Schuljahr (Jahresdurchschnitt) */}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Jahresdurchschnitt</TableCell>
            {sortedSchuljahrs.map((schuljahr) => (
              <TableCell key={schuljahr} sx={{ fontWeight: 'bold' }}>
                {calculateAverageByYear(grades, schuljahr)}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DurchschnittsListe;
