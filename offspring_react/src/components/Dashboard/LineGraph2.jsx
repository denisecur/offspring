import React, { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const LineGraph2 = ({ grades, subjectName }) => {
  // Berechnung des gewichteten Durchschnitts
  const calculateAverage = (arr) => {
    if (!arr.length) return 0;
    let sum = 0;
    let weight = 0;
    for (let g of arr) {
      const w = g.gewichtung || 1;
      sum += parseFloat(g.wert) * w;
      weight += w;
    }
    return weight === 0 ? 0 : (sum / weight).toFixed(2);
  };

  const overallAverage = calculateAverage(grades);

  // Diagrammdaten vorbereiten: Datum formatieren und sortieren
  const chartData = useMemo(() => {
    const dataWithDates = grades.map((g) => {
      const dateObj = new Date(g.datum);
      return {
        datum: dateObj.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
        note: parseFloat(g.wert),
        rawDate: dateObj,
      };
    });
    dataWithDates.sort((a, b) => a.rawDate - b.rawDate);
    return dataWithDates.map(({ rawDate, ...rest }) => rest);
  }, [grades]);

  // Anstatt frühzeitig zu returnen, definieren wir den Inhalt bedingt:
  const content =
    chartData.length < 2 ? (
      <Box
        sx={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1">
          Keine ausreichenden Daten vorhanden
        </Typography>
      </Box>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {/* Hintergrund weiß */}
          <rect x={0} y={0} width="100%" height="100%" fill="#fff" />
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="datum" tick={{ fill: "#666", fontSize: 12 }} />
          <YAxis domain={[1, 6]} tick={{ fill: "#666", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            labelStyle={{ color: "#666" }}
          />
          <Legend
            payload={[
              { value: "Graph", type: "line", id: "lineGraph", color: "#0000FF" },
              {
                value: "Durchschnitt",
                type: "line",
                id: "average",
                color: "#FF4560",
              },
            ]}
            wrapperStyle={{ fontSize: 12, color: "#666" }}
          />
          <Line
            type="monotone"
            dataKey="note"
            stroke="#0000FF"
            strokeWidth={1}
            dot={{ r: 3, fill: "#0000FF" }}
          />
          <ReferenceLine
            y={parseFloat(overallAverage) || 0}
            stroke="#FF4560"
            strokeDasharray="6 6"
            strokeWidth={3}
            label={{
              value: `Durchschnitt: ${overallAverage}`,
              position: "right",
              fill: "#FF4560",
              fontSize: 12,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
        {subjectName} – Durchschnitt: {overallAverage}
      </Typography>
      {content}
    </Paper>
  );
};

export default LineGraph2;
