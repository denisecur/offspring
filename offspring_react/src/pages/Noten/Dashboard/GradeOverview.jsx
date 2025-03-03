import React from "react";
import { Box, Typography, Card, CardContent, Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const GradeOverview = ({ grades, faecher }) => {
  const [selectedYear, setSelectedYear] = React.useState("");

  // Funktion zur Berechnung des Schuljahres
  const getSchoolYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  // Berechne den Gesamtdurchschnitt
  const calculateAverage = (grades) => {
    if (grades.length === 0) return "N/A";
    const sum = grades.reduce((total, grade) => total + parseFloat(grade.wert) * grade.gewichtung, 0);
    const totalWeight = grades.reduce((total, grade) => total + parseFloat(grade.gewichtung), 0);
    return (sum / totalWeight).toFixed(2);
  };

  // Gruppiere Noten nach Schuljahren
  const gradesByYear = grades.reduce((acc, grade) => {
    const year = getSchoolYear(grade.datum);
    if (!acc[year]) acc[year] = [];
    acc[year].push(grade);
    return acc;
  }, {});

  // Verfügbare Schuljahre
  const schoolYears = Object.keys(gradesByYear).sort();

  // Gefilterte Noten basierend auf dem ausgewählten Jahr
  const filteredGrades = selectedYear ? gradesByYear[selectedYear] : grades;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
        Notenübersicht
      </Typography>

      {/* Schuljahr-Auswahl */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Schuljahr auswählen</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          label="Schuljahr auswählen"
        >
          <MenuItem value="">Alle Jahre</MenuItem>
          {schoolYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Gesamtdurchschnitt */}
      <Card sx={{ mb: 3, backgroundColor: "background.paper" }}>
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Gesamtdurchschnitt {selectedYear && `(${selectedYear})`}
          </Typography>
          <Typography variant="body" sx={{ fontWeight: "bold", color: "primary.main" }}>
            {calculateAverage(filteredGrades)}
          </Typography>
        </CardContent>
      </Card>

      {/* Durchschnitt pro Fach */}
      <Grid container spacing={3}>
        {faecher.map((fach) => {
          const fachGrades = filteredGrades.filter((grade) => grade.ausbildungsfach?.id === fach.id);
          const fachAverage = calculateAverage(fachGrades);

          return (
            <Grid item xs={12} sm={6} md={4} key={fach.id}>
              <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
                <CardContent>
                  
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {fach.name}
                  </Typography>
                  <Typography variant="body" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    {fachAverage}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GradeOverview;