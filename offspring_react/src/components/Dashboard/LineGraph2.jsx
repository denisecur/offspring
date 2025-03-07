// src/components/LineGraph.jsx
import React, { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const LineGraph2 = ({ grades, subjectName }) => {
  // Berechnung des Durchschnitts aus den Noten
  const calculateAverage = (arr) => {
    if (!arr.length) return 0;
    let sum = 0;
    let weight = 0;
    for (let g of arr) {
      const w = g.gewichtung || 1;
      sum += parseFloat(g.wert) * w;
      weight += w;
    }
    if (weight === 0) return 0;
    return (sum / weight).toFixed(2);
  };

  const overallAverage = calculateAverage(grades);

  // Diagrammdaten aufbereiten: sortiert nach Datum
  const chartData = useMemo(() => {
    return grades
      .map((g) => ({
        datum: new Date(g.datum).toLocaleDateString(),
        note: parseFloat(g.wert),
      }))
      .sort((a, b) => new Date(a.datum) - new Date(b.datum));
  }, [grades]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {subjectName} – Durchschnitt: {overallAverage}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
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
            y={parseFloat(overallAverage) || 0}
            stroke="#FFC107"
            strokeDasharray="3 3"
            label={{
              value: `Durchschnitt: ${overallAverage}`,
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

export default LineGraph2;
