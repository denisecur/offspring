import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const GradeTable = ({ grades, filter, faecher }) => {
  // Aktive Filter sammeln
  const activeFilters = [];

  // Fachname ermitteln
  const selectedFach = faecher.find((fach) => fach.id === parseInt(filter.fach));

  if (filter.fach && selectedFach) {
    activeFilters.push(`Fach: ${selectedFach.name}`);
  }

  if (filter.art) {
    activeFilters.push(`Art: ${filter.art}`);
  }

  if (filter.jahr) {
    activeFilters.push(`Schuljahr: ${filter.jahr}`);
  }

  // Definition von showFachColumn
  const showFachColumn = !filter.fach; // Zeigt die Spalte "Fach" nur an, wenn kein Fach gefiltert ist

  return (
    <div>
      {/* Aktive Filter anzeigen */}
      {activeFilters.length > 0 && (
        <Typography variant="subtitle1" gutterBottom>
          <strong>Aktive Filter:</strong> {activeFilters.join(', ')}
        </Typography>
      )}

      {/* Tabelle */}
      <TableContainer component={Paper}>
        <Table aria-label="Notentabelle">
          <TableHead>
            <TableRow>
              {showFachColumn && (
                <TableCell>
                  <strong>Fach</strong>
                </TableCell>
              )}
              <TableCell>
                <strong>Note</strong>
              </TableCell>
              <TableCell>
                <strong>Art</strong>
              </TableCell>
              <TableCell>
                <strong>Datum</strong>
              </TableCell>
              <TableCell>
                <strong>Gewichtung</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id}>
                {showFachColumn && (
                  <TableCell>
                    {grade.ausbildungsfach
                      ? grade.ausbildungsfach.name
                      : 'Nicht zugeordnet'}
                  </TableCell>
                )}
                <TableCell>{grade.wert}</TableCell>
                <TableCell>{grade.art}</TableCell>
                <TableCell>{grade.datum}</TableCell>
                <TableCell>{grade.gewichtung}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GradeTable;
