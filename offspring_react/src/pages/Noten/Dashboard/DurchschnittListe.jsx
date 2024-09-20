import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  Typography,
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

// Gesamtdurchschnitt berechnen für ein Fach über alle Jahre
const calculateTotalAverageByFach = (grades, fachName) => {
  const filteredGrades = grades.filter(
    (grade) => grade.ausbildungsfach.name === fachName
  );
  return calculateAverage(filteredGrades);
};

// Gesamtdurchschnitt berechnen über alle Fächer und Jahre
const calculateTotalAverage = (grades) => {
  return calculateAverage(grades);
};

// Hauptkomponente zur Anzeige der Liste der Fächer mit Notendurchschnitten
const DurchschnittsListe = ({ grades }) => {
  // Dynamisch die Schuljahre und Fächer aus den Noten ermitteln
  const schuljahrs = [...new Set(grades.map((grade) => getSchoolYear(grade.datum)))];
  const fachs = [...new Set(grades.map((grade) => grade.ausbildungsfach.name))];
  const kennzahlen = ['Fachdurchschnitt', 'Jahresdurchschnitt', 'Gesamtdurchschnitt'];

  // State für die Auswahloptionen
  const [selectedYears, setSelectedYears] = useState(schuljahrs);
  const [selectedFachs, setSelectedFachs] = useState(fachs);
  const [selectedKennzahlen, setSelectedKennzahlen] = useState(kennzahlen);

  // Handhabung der Auswahländerungen
  const handleYearChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedYears(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFachChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFachs(typeof value === 'string' ? value.split(',') : value);
  };

  const handleKennzahlChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedKennzahlen(typeof value === 'string' ? value.split(',') : value);
  };

  // Filterung der Daten basierend auf den ausgewählten Jahren und Fächern
  const filteredGrades = grades.filter(
    (grade) =>
      selectedYears.includes(getSchoolYear(grade.datum)) &&
      selectedFachs.includes(grade.ausbildungsfach.name)
  );

  // Sortierte Schuljahre basierend auf der Auswahl
  const sortedSchuljahrs = selectedYears.sort((a, b) => {
    const yearA = parseInt(a.split('/')[0], 10);
    const yearB = parseInt(b.split('/')[0], 10);
    return yearA - yearB;
  });

  return (
    <div>
      {/* Auswahloptionen */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Jahr Auswahl */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="jahr-label">Jahr</InputLabel>
          <Select
            labelId="jahr-label"
            multiple
            value={selectedYears}
            onChange={handleYearChange}
            input={<OutlinedInput label="Jahr" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {schuljahrs.map((jahr) => (
              <MenuItem key={jahr} value={jahr}>
                <Checkbox checked={selectedYears.indexOf(jahr) > -1} />
                <ListItemText primary={jahr} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Fach Auswahl */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="fach-label">Fach</InputLabel>
          <Select
            labelId="fach-label"
            multiple
            value={selectedFachs}
            onChange={handleFachChange}
            input={<OutlinedInput label="Fach" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {fachs.map((fach) => (
              <MenuItem key={fach} value={fach}>
                <Checkbox checked={selectedFachs.indexOf(fach) > -1} />
                <ListItemText primary={fach} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Kennzahlen Auswahl */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="kennzahl-label">Kennzahlen</InputLabel>
          <Select
            labelId="kennzahl-label"
            multiple
            value={selectedKennzahlen}
            onChange={handleKennzahlChange}
            input={<OutlinedInput label="Kennzahlen" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {kennzahlen.map((kennzahl) => (
              <MenuItem key={kennzahl} value={kennzahl}>
                <Checkbox checked={selectedKennzahlen.indexOf(kennzahl) > -1} />
                <ListItemText primary={kennzahl} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabelle */}
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
              {selectedKennzahlen.includes('Fachdurchschnitt') && (
                <TableCell sx={{ fontWeight: 'bold' }}>Fachdurchschnitt</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedFachs.map((fachName) => (
              <TableRow key={fachName}>
                <TableCell component="th" scope="row">
                  {fachName}
                </TableCell>
                {sortedSchuljahrs.map((schuljahr) => (
                  <TableCell key={schuljahr}>
                    {calculateAverageByFachAndSchuljahr(filteredGrades, fachName, schuljahr)}
                  </TableCell>
                ))}
                {selectedKennzahlen.includes('Fachdurchschnitt') && (
                  <TableCell>
                    {calculateTotalAverageByFach(filteredGrades, fachName)}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {/* Jahresdurchschnitt */}
            {selectedKennzahlen.includes('Jahresdurchschnitt') && (
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Jahresdurchschnitt</TableCell>
                {sortedSchuljahrs.map((schuljahr) => (
                  <TableCell key={schuljahr} sx={{ fontWeight: 'bold' }}>
                    {calculateAverageByYear(filteredGrades, schuljahr)}
                  </TableCell>
                ))}
                {selectedKennzahlen.includes('Gesamtdurchschnitt') && (
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {calculateTotalAverage(filteredGrades)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DurchschnittsListe;
