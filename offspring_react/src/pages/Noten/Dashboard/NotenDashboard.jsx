import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { BarChart, TableChart } from '@mui/icons-material';

// Hilfsfunktionen zur Berechnung von Durchschnitten
const getSchoolYear = (datum) => {
  const date = new Date(datum);
  const year = date.getFullYear();
  const month = date.getMonth();
  const startYear = month >= 8 ? year : year - 1;
  const endYear = (startYear + 1).toString().slice(2); // Nur die letzten zwei Ziffern des Endjahres
  return `${startYear}/${endYear}`;
};

const calculateAverage = (grades) => {
  if (grades.length === 0) return null;
  const totalWeightedSum = grades.reduce(
    (sum, grade) => sum + grade.wert * grade.gewichtung,
    0
  );
  const totalWeight = grades.reduce((sum, grade) => sum + grade.gewichtung, 0);
  return (totalWeightedSum / totalWeight).toFixed(2);
};

const calculateAverageByFach = (grades, fachName) => {
  const filteredGrades = grades.filter(
    (grade) => grade.ausbildungsfach.name === fachName
  );
  return calculateAverage(filteredGrades);
};

const calculateAverageByYear = (grades, schuljahr) => {
  const filteredGrades = grades.filter(
    (grade) => getSchoolYear(grade.datum) === schuljahr
  );
  return calculateAverage(filteredGrades);
};

const getGradeColor = (value) => {
  if (value <= 1.5) return 'green';
  if (value >= 4) return 'red';
  return 'black';
};

// Hauptkomponente
const NotenDashboard = ({ grades }) => {
  // Dynamische Daten
  const schuljahrs = [
    ...new Set(grades.map((grade) => getSchoolYear(grade.datum))),
  ];
  const fachs = [
    ...new Set(grades.map((grade) => grade.ausbildungsfach.name)),
  ];

  // State für Filter und Ansicht
  const [selectedYears, setSelectedYears] = useState(schuljahrs);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'fach', 'jahr'

  // Event-Handler
  const handleYearChange = (event) => {
    const { value } = event.target;
    setSelectedYears(typeof value === 'string' ? value.split(',') : value);
  };

  const handleViewModeChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Gefilterte Noten
  const filteredGrades = grades.filter((grade) =>
    selectedYears.includes(getSchoolYear(grade.datum))
  );

  // Gesamtdurchschnitt
  const totalAverage = calculateAverage(filteredGrades);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Filteroptionen */}
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

        {/* Ansichtsauswahl */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="Ansichtsauswahl"
          sx={{ ml: 'auto' }}
        >
          <ToggleButton value="overview" aria-label="Übersicht">
            <BarChart /> Übersicht
          </ToggleButton>
          <ToggleButton value="fach" aria-label="Fächer">
            <TableChart /> Fächer
          </ToggleButton>
          <ToggleButton value="jahr" aria-label="Jahre">
            <TableChart /> Jahre
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Dashboard Inhalt */}
      {viewMode === 'overview' && (
        <Grid container spacing={2}>
          {/* Aktueller Gesamtdurchschnitt */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  Aktueller Gesamtdurchschnitt
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    color: 'primary.main',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalAverage || 'Keine Daten'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Durchschnitt pro Fach */}
          {fachs.map((fach) => (
            <Grid item xs={12} sm={6} md={4} key={fach}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {fach}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Durchschnittsnote
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: getGradeColor(
                        calculateAverageByFach(filteredGrades, fach)
                      ),
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {calculateAverageByFach(filteredGrades, fach) || 'Keine Daten'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {viewMode === 'fach' && (
        <Box sx={{ mt: 3 }}>
          {/* Tabelle pro Fach */}
          <TableContainer component={Paper}>
            <Table aria-label="Durchschnitt pro Fach">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fach</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Durchschnittsnote
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fachs.map((fach) => (
                  <TableRow key={fach}>
                    <TableCell>{fach}</TableCell>
                    <TableCell>
                      {calculateAverageByFach(filteredGrades, fach) || 'Keine Daten'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {viewMode === 'jahr' && (
        <Box sx={{ mt: 3 }}>
          {/* Tabelle pro Jahr */}
          <TableContainer component={Paper}>
            <Table aria-label="Durchschnitt pro Jahr">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Jahr</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Durchschnittsnote
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedYears.map((jahr) => (
                  <TableRow key={jahr}>
                    <TableCell>{jahr}</TableCell>
                    <TableCell>
                      {calculateAverageByYear(filteredGrades, jahr) || 'Keine Daten'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default NotenDashboard;
