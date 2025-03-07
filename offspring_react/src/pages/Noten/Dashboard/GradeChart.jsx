import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import {
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

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
  const calculateAverage = (gradesArr) => {
    if (gradesArr.length === 0) return 0;
    const sum = gradesArr.reduce(
      (total, grade) => total + parseFloat(grade.wert) * grade.gewichtung,
      0
    );
    const totalWeight = gradesArr.reduce(
      (total, grade) => total + parseFloat(grade.gewichtung),
      0
    );
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
      };
    })
    .sort((a, b) => new Date(a.datum) - new Date(b.datum));

  // Verfügbare Schuljahre für das Dropdown
  const schoolYears = [
    ...new Set(grades.map((grade) => getSchoolYear(grade.datum))),
  ].sort();

  return (
    <Paper sx={{ p: 4, mb: 4, backgroundColor: "background.paper" }}>
      {/* Grid-Container für Fach- und Schuljahr-Auswahl */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Fach-Auswahl */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" size="small">
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
        </Grid>

        {/* Schuljahr-Auswahl */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" size="small">
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
        </Grid>
      </Grid>

      {/* Liniendiagramm mit farbigem Hintergrund und Durchschnittslinie */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <XAxis dataKey="datum" />
          <YAxis domain={[1, 6]} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="note"
            fillOpacity={0.3}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            stackId="1"
          />
          <Line
            type="monotone"
            dataKey="note"
            stroke="#8884d8"
            strokeWidth={2}
            dot={true}
          />
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
