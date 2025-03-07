import React, { useState, useMemo } from "react";
import { Box, Autocomplete, TextField, Typography, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { calculateAverage } from "../../../api_services/noten/calculations";
const CompetitiveComparisonBarChart = ({ allGrades, faecher }) => {
  // Extrahiere eindeutige Azubis aus allen Noten
  const uniqueAzubis = useMemo(() => {
    const map = {};
    allGrades.forEach((grade) => {
      if (grade.owner) {
        map[grade.owner.id] = grade.owner;
      }
    });
    return Object.values(map);
  }, [allGrades]);

  // Zustände für ausgewählte Azubis und Fächer
  const [selectedAzubis, setSelectedAzubis] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Erstelle Chart-Daten:
  // Für jedes Fach: 
  // - Für jeden Azubi wird der Durchschnitt (z. B. 2,3) berechnet und dann in Score transformiert: Score = 7 - Durchschnitt (also 4,7)
  // - Außerdem speichern wir den Originalwert
  const chartData = useMemo(() => {
    return selectedSubjects.map((subject) => {
      const dataPoint = { subject: subject.name };

      // Werte für jeden ausgewählten Azubi
      selectedAzubis.forEach((azubi) => {
        const azubiGrades = allGrades.filter(
          (grade) =>
            grade.owner?.id === azubi.id &&
            grade.ausbildungsfach?.id === subject.id
        );
        let avg = calculateAverage(azubiGrades);
        avg = avg === "N/A" ? 6 : parseFloat(avg);
        const score = 7 - avg; // Transformation: Note 1 => Score 6, Note 6 => Score 1
        dataPoint[azubi.username] = score;
        dataPoint[`${azubi.username}_original`] = avg;
      });

      // Klassen-Durchschnitt im Fach (über alle Noten)
      const allSubjectGrades = allGrades.filter(
        (grade) => grade.ausbildungsfach?.id === subject.id
      );
      let classAvg = calculateAverage(allSubjectGrades);
      classAvg = classAvg === "N/A" ? 6 : parseFloat(classAvg);
      dataPoint["Class Average"] = 7 - classAvg;
      dataPoint["Class Average_original"] = classAvg;

      return dataPoint;
    });
  }, [selectedSubjects, selectedAzubis, allGrades]);

  // Farbpalette für die Balken der einzelnen Azubis
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE"];

  // Custom Tooltip: Zeigt für jeden Balken den transformierten Score und den Originalwert an
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            p: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => {
            const originalKey = entry.dataKey + "_original";
            const originalValue = entry.payload[originalKey];
            return (
              <Typography key={index} variant="body2" sx={{ color: entry.fill }}>
                {entry.name}: {entry.value} (Original: {originalValue})
              </Typography>
            );
          })}
        </Box>
      );
    }
    return null;
  };

  // Custom Label: Berechnet den Rang basierend auf den transformierten Werten
  const renderCustomLabel = (azubiUsername) => (props) => {
    const { x, y, value, payload } = props;
    if (!payload) return null;
    const scores = selectedAzubis.map((a) =>
      payload[a.username] !== undefined ? payload[a.username] : 0
    );
    const sortedScores = [...scores].sort((a, b) => b - a);
    const currentScore = payload.hasOwnProperty(azubiUsername) ? payload[azubiUsername] : 0;
    const rank = sortedScores.indexOf(currentScore) + 1;
    return (
      <text x={x + 5} y={y - 5} fill="#000" fontSize="12px">
        {rank === 1 ? "Spitzenreiter" : `Platz ${rank}`}
      </text>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Competitive Comparison (Bar Chart)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Wählen Sie Azubis und Fächer aus, um deren Leistung (umgerechnet von 6 bis 1) nebeneinander zu vergleichen.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {/* Multi-Select für Azubis */}
        <Autocomplete
          multiple
          options={uniqueAzubis}
          getOptionLabel={(option) => option.username}
          onChange={(event, newValue) => setSelectedAzubis(newValue)}
          renderInput={(params) => <TextField {...params} label="Azubis auswählen" />}
          sx={{ minWidth: 300 }}
        />
        {/* Multi-Select für Fächer */}
        <Autocomplete
          multiple
          options={faecher}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedSubjects(newValue)}
          renderInput={(params) => <TextField {...params} label="Fächer auswählen" />}
          sx={{ minWidth: 300 }}
        />
      </Box>
      <Paper sx={{ p: 2 }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            {/* Y-Achse: von 1 (schlechteste Leistung) bis 6 (beste Leistung) */}
            <YAxis domain={[1, 6]} />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend />
            {selectedAzubis.map((azubi, index) => (
              <Bar
                key={azubi.id}
                dataKey={azubi.username}
                fill={colors[index % colors.length]}
                label={renderCustomLabel(azubi.username)}
              />
            ))}
            <Bar
              dataKey="Class Average"
              fill="#000000"
              label={({ x, y, value }) => (
                <text x={x + 5} y={y - 5} fill="#000" fontSize="12px">
                  {`Klasse: ${value}`}
                </text>
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default CompetitiveComparisonBarChart;
