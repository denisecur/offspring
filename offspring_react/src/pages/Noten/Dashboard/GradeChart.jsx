import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { Typography, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GradeChart = ({ grades, faecher }) => {
  const [selectedFach, setSelectedFach] = useState(faecher[0]?.id || "");
  const [selectedYear, setSelectedYear] = useState("");

  // Funktion zur Berechnung des Schuljahres
  const getSchoolYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  // Filtere Noten nach ausgewähltem Fach und Jahr
  const filteredGrades = grades
    .filter((grade) => grade.ausbildungsfach?.id === selectedFach)
    .filter((grade) => !selectedYear || getSchoolYear(grade.datum) === selectedYear);

  // Berechne den Gesamtdurchschnitt des Faches (über alle Jahre)
  const calculateAverage = (grades) => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((total, grade) => total + parseFloat(grade.wert) * grade.gewichtung, 0);
    const totalWeight = grades.reduce((total, grade) => total + parseFloat(grade.gewichtung), 0);
    return (sum / totalWeight).toFixed(2);
  };

  const fachGrades = grades.filter((grade) => grade.ausbildungsfach?.id === selectedFach);
  const fachAverage = calculateAverage(fachGrades);

  // Daten für das Diagramm vorbereiten
  const chartData = filteredGrades
    .map((grade) => {
      const note = parseFloat(grade.wert);
      return {
        datum: new Date(grade.datum).toLocaleDateString(),
        note,
        color: note <= 2 ? "#4CAF50" : note >= 5 ? "#F44336" : "#8884d8", // Grüne, rote oder standard Farbe
      };
    })
    .sort((a, b) => new Date(a.datum) - new Date(b.datum));

  // Verfügbare Schuljahre für das Dropdown
  const schoolYears = [
    ...new Set(grades.map((grade) => getSchoolYear(grade.datum))),
  ].sort();

  return (
    <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.paper" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
        Notenverlauf
      </Typography>

      {/* Fach-Auswahl */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Fach auswählen</InputLabel>
        <Select
          value={selectedFach}
          onChange={(e) => setSelectedFach(e.target.value)}
          label="Fach auswählen"
        >
          {faecher.map((fach) => (
            <MenuItem key={fach.id} value={fach.id}>
              {fach.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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

      {/* Liniendiagramm mit farbigem Hintergrund und Durchschnittslinie */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <XAxis dataKey="datum" />
          <YAxis domain={[1, 6]} />
          <Tooltip />
          <Legend />
          {/* Grüner Bereich für Noten 1-2 */}
          <Area
            type="monotone"
            dataKey="note"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.3}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            stackId="1"
            hide={chartData.every((d) => d.note > 2)} // Nur anzeigen, wenn Noten <= 2 vorhanden sind
          />
          {/* Roter Bereich für Noten 5-6 */}
          <Area
            type="monotone"
            dataKey="note"
            stroke="#F44336"
            fill="#F44336"
            fillOpacity={0.3}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            stackId="2"
            hide={chartData.every((d) => d.note < 5)} // Nur anzeigen, wenn Noten >= 5 vorhanden sind
          />
          {/* Standard-Linie für den Rest */}
          <Line
            type="monotone"
            dataKey="note"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          {/* Durchschnittslinie */}
          <ReferenceLine
            y={fachAverage}
            stroke="#FFC107"
            strokeDasharray="3 3"
            label={{
              value: `Durchschnitt: ${fachAverage}`,
              position: "right",
              fill: "#FFC107",
              fontSize: 12,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GradeChart;