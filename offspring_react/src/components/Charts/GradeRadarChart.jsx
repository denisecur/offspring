import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

const GradeRadarChart = ({ grades, faecher }) => {
  // Durchschnitt berechnen
  const calculateAverage = (subjectGrades) => {
    if (subjectGrades.length === 0) return 0;
    const sum = subjectGrades.reduce(
      (acc, grade) => acc + parseFloat(grade.wert) * parseFloat(grade.gewichtung),
      0
    );
    const totalWeight = subjectGrades.reduce(
      (acc, grade) => acc + parseFloat(grade.gewichtung),
      0
    );
    return sum / totalWeight; // z. B. 2.3
  };

  // Radar-Daten: wir erwarten, dass `grades` ggf. schon gefiltert ist
  const data = faecher.map((fach) => {
    const subjectGrades = grades.filter((g) => g.ausbildungsfach?.id === fach.id);
    const originalAverage = calculateAverage(subjectGrades);
    const score = 7 - originalAverage; // Je besser die Note, desto größer der "score"
    return {
      subject: fach.name,
      score,
      originalAverage,
      fullMark: 6,
    };
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Radar-Ansicht
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[1, 6]} />

          <Radar
            name="Score"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />

          <Tooltip
            formatter={(value, name, props) => {
              const realAvg = props.payload.originalAverage.toFixed(2);
              return [realAvg, "Durchschnitt"];
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GradeRadarChart;
