import { calculateAverage } from "../../../api_services/noten/calculations";
import React, { useState, useMemo } from "react";
import { Box, Autocomplete, TextField, Typography, Paper } from "@mui/material";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { all } from "axios";

// Benutzerdefinierter Tooltip, der mehr Info anzeigt
const CustomRadarTooltip = ({ active, payload, label }) => {
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
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={`item-${index}`} variant="body2" sx={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const CompetitiveComparison = ({ allGrades, faecher }) => {
  console.log("knn" + {allGrades});
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
  // Für jedes ausgewählte Fach wird für jeden ausgewählten Azubi der Durchschnitt
  // berechnet und zusätzlich der Klassen‑Durchschnitt ermittelt.
  const chartData = useMemo(() => {
    return selectedSubjects.map((subject) => {
      const dataPoint = { subject: subject.name };

      // Durchschnitt für jeden ausgewählten Azubi im Fach
      selectedAzubis.forEach((azubi) => {
        const azubiGrades = allGrades.filter(
          (grade) =>
            grade.owner?.id === azubi.id &&
            grade.ausbildungsfach?.id === subject.id
        );
        let avg = calculateAverage(azubiGrades);
        avg = avg === "N/A" ? 0 : parseFloat(avg);
        dataPoint[azubi.username] = avg;
      });

      // Klassen-Durchschnitt im Fach über alle Noten
      const allSubjectGrades = allGrades.filter(
        (grade) => grade.ausbildungsfach?.id === subject.id
      );
      let classAvg = calculateAverage(allSubjectGrades);
      classAvg = classAvg === "N/A" ? 0 : parseFloat(classAvg);
      dataPoint["Class Average"] = classAvg;

      return dataPoint;
    });
  }, [selectedSubjects, selectedAzubis, allGrades]);

  // Farbpalette für die verschiedenen Azubi-Linien
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE"];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Competitive Comparison
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Wählen Sie die Azubis und Fächer aus, um deren Leistung im Vergleich zu sehen.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {/* Multi-Select für Azubis */}
        <Autocomplete
          multiple
          options={uniqueAzubis}
          getOptionLabel={(option) => option.username}
          onChange={(event, newValue) => setSelectedAzubis(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Azubis auswählen" />
          )}
          sx={{ minWidth: 300 }}
        />
        {/* Multi-Select für Fächer */}
        <Autocomplete
          multiple
          options={faecher}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedSubjects(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Fächer auswählen" />
          )}
          sx={{ minWidth: 300 }}
        />
      </Box>
      <Paper sx={{ p: 2 }}>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Tooltip content={<CustomRadarTooltip />} />
            <Legend />
            {selectedAzubis.map((azubi, index) => (
              <Radar
                key={azubi.id}
                name={azubi.username}
                dataKey={azubi.username}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            <Radar
              name="Class Average"
              dataKey="Class Average"
              stroke="#000000"
              fill="#000000"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default CompetitiveComparison;
