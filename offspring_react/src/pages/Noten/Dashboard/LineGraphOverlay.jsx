// src/components/LineGraphOverlay.jsx
import React, { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Diese Komponente erwartet:
 * - grades: Array mit den Noten (mit Datum, wert, ausbildungsfach)
 * - faecher: Array aller Fächer (Objekte mit id und name)
 * - selectedFaecher (optional): Array von Fach-IDs, die im Overlay erscheinen sollen.
 *   Ist dieses Array leer oder nicht gesetzt, werden alle Fächer berücksichtigt.
 */
const LineGraphOverlay = ({ grades, faecher, selectedFaecher = [] }) => {
  // Bestimme, welche Fächer im Diagramm erscheinen sollen.
  const subjectsToInclude =
    selectedFaecher.length > 0
      ? faecher.filter((f) => selectedFaecher.includes(f.id))
      : faecher;

  // Aggregiere die Noten pro Datum und pro Fach sowie den Gesamtdurchschnitt.
  const chartData = useMemo(() => {
    const dataMap = {};
    grades.forEach((g) => {
      const dateStr = new Date(g.datum).toLocaleDateString();
      if (!dataMap[dateStr]) {
        dataMap[dateStr] = { datum: dateStr, overallSum: 0, overallCount: 0 };
      }
      const subjectId = g.ausbildungsfach?.id;
      // Falls es für das Fach noch keinen Eintrag gibt, initialisieren.
      if (!dataMap[dateStr][subjectId]) {
        dataMap[dateStr][subjectId] = { sum: 0, count: 0 };
      }
      const gradeValue = parseFloat(g.wert);
      dataMap[dateStr][subjectId].sum += gradeValue;
      dataMap[dateStr][subjectId].count += 1;
      // Gesamtdurchschnitt berechnen
      dataMap[dateStr].overallSum += gradeValue;
      dataMap[dateStr].overallCount += 1;
    });
    // Erstelle das Datenarray für Recharts.
    const dataArray = Object.keys(dataMap).map((dateStr) => {
      const entry = { datum: dateStr };
      // Für jedes Fach, das angezeigt werden soll, den Durchschnitt berechnen.
      subjectsToInclude.forEach((subject) => {
        const subjData = dataMap[dateStr][subject.id];
        entry[subject.name] =
          subjData && subjData.count > 0
            ? parseFloat((subjData.sum / subjData.count).toFixed(2))
            : null;
      });
      // Gesamtdurchschnitt des Datums
      entry["Overall"] =
        dataMap[dateStr].overallCount > 0
          ? parseFloat(
              (dataMap[dateStr].overallSum / dataMap[dateStr].overallCount).toFixed(2)
            )
          : null;
      return entry;
    });
    // Sortiere das Array chronologisch
    return dataArray.sort((a, b) => new Date(a.datum) - new Date(b.datum));
  }, [grades, subjectsToInclude]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Notendurchschnitt – Overlay aller ausgewählten Fächer und Gesamt
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="datum" />
          <YAxis domain={[1, 6]} />
          <Tooltip />
          <Legend />
          {/* Für jedes Fach wird eine Linie gezeichnet */}
          {subjectsToInclude.map((subject) => (
            <Line
              key={subject.id}
              type="monotone"
              dataKey={subject.name}
              stroke="#8884d8" // Hier könnte man ggf. dynamische Farben einsetzen
              strokeWidth={2}
              dot={true}
            />
          ))}
          {/* Linie für den Gesamtdurchschnitt */}
          <Line
            type="monotone"
            dataKey="Overall"
            stroke="#FFC107"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default LineGraphOverlay;
