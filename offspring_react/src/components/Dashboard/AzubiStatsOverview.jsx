import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import GradeRadarChart from "../Charts/GradeRadarChart";
import ChartErklärungsBox from "../Charts/ChartErklärungsBox";

export default function AzubiStatsOverview({ selectedAzubi, grades, faecher }) {
  const [hover, setHover] = useState(false);

  // Hier definieren wir die Props, die an die ChartErklärungsBox übergeben werden sollen
  const explanationTitle = "Radar Chart Erklärung";
  const explanationText =
    "Dieses RadarChart zeigt den Notendurchschnitt pro Fach an. Ein höherer Score entspricht einer besseren Note.";

  return (
    <Card
      sx={{ mb: 3, backgroundColor: "background.paper", position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Azubi Stats Overview
        </Typography>
        {hover && (
          <ChartErklärungsBox title={explanationTitle} text={explanationText} />
        )}
        <GradeRadarChart grades={grades} faecher={faecher} />
      </CardContent>
    </Card>
  );
}
