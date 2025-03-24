import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";

function calcAverage(values) {
  if (!values.length) return "--";
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  return avg.toFixed(2);
}

const CompetitiveComparison = ({ allGrades }) => {
  if (!allGrades || !allGrades.length) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        Keine Noten vorhanden.
      </Typography>
    );
  }

  const azubiStartYears = {};
  allGrades.forEach((grade) => {
    const { owner } = grade;
    if (!owner) return;
    const uid = owner.id;
    const gradeYear = new Date(grade.datum).getFullYear();
    if (!azubiStartYears[uid] || gradeYear < azubiStartYears[uid]) {
      azubiStartYears[uid] = gradeYear;
    }
  });

  const groupedData = {};
  allGrades.forEach((grade) => {
    const fachrichtung =
      grade.ausbildungsfach && grade.ausbildungsfach.name
        ? getAusbildungsrichtung(grade)
        : "Unbekannt";
    if (fachrichtung === "Unbekannt") return;
    const startYear = azubiStartYears[grade.owner?.id];
    if (!groupedData[fachrichtung]) groupedData[fachrichtung] = {};
    if (!groupedData[fachrichtung][startYear]) {
      groupedData[fachrichtung][startYear] = [];
    }
    groupedData[fachrichtung][startYear].push(grade);
  });

  const groupSummaries = [];
  Object.keys(groupedData).forEach((fachrichtung) => {
    const starts = groupedData[fachrichtung];
    Object.keys(starts).forEach((startYear) => {
      const gradesGroup = starts[startYear];
      const groupValues = gradesGroup.map((g) => parseFloat(g.wert || 0));
      const overallAvg = calcAverage(groupValues);

      const azubiMap = {};
      gradesGroup.forEach((g) => {
        const { owner } = g;
        if (!owner) return;
        if (!azubiMap[owner.id]) {
          azubiMap[owner.id] = { total: 0, count: 0, azubi: owner };
        }
        azubiMap[owner.id].total += parseFloat(g.wert || 0);
        azubiMap[owner.id].count += 1;
      });

      let bestAzubi = null;
      let bestAverage = Infinity;
      Object.values(azubiMap).forEach(({ total, count, azubi }) => {
        const avg = count ? total / count : 0;
        if (avg < bestAverage) {
          bestAzubi = azubi;
          bestAverage = avg;
        }
      });

      groupSummaries.push({
        fachrichtung,
        startYear,
        overallAvg,
        bestAzubi,
        bestAzubiAvg: bestAzubi ? bestAverage.toFixed(2) : "--",
      });
    });
  });

  groupSummaries.sort((a, b) => {
    if (a.fachrichtung < b.fachrichtung) return -1;
    if (a.fachrichtung > b.fachrichtung) return 1;
    return b.startYear - a.startYear;
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Detaillierte Übersicht nach Ausbildungsrichtung & Startjahr
      </Typography>
      {groupSummaries.map((group, idx) => (
        <Paper
          key={`${group.fachrichtung}-${group.startYear}-${idx}`}
          sx={{ p: 2, mb: 2, borderRadius: 2 }}
          elevation={3}
        >
          <Typography variant="subtitle1" gutterBottom>
            {group.fachrichtung} – Start {group.startYear}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Gesamt-Durchschnitt</Typography>
                <Typography variant="h6">{group.overallAvg}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">Bester Azubi</Typography>
                {group.bestAzubi ? (
                  <>
                    <Typography variant="h6" component="span">
                      {group.bestAzubi.username}
                    </Typography>
                    <Typography variant="body2">
                      ∅ {group.bestAzubiAvg}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2">Keine Daten</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography align="center" variant="body2">
                  Trendanalyse für Jahrgang {group.startYear} <br />
                  {group.fachrichtung}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default CompetitiveComparison;

// Hilfsfunktion getAusbildungsrichtung
function getAusbildungsrichtung(grade) {
  if (grade.ausbildungsfach && grade.ausbildungsfach.name) {
    const fachName = grade.ausbildungsfach.name.toLowerCase().trim(); 
    if (ausbildungsfaecherMapping[fachName]) {
      return ausbildungsfaecherMapping[fachName];
    }
  }
  return "Unbekannt";
}

const ausbildungsfaecherMapping = {
  // Büromanagement
  "deutsch": "Büromanagement",
  "englisch": "Büromanagement",
  "betriebs- und gesamtwirtschaftliche prozesse": "Büromanagement",
  "kundengewinnung und geschäftsprozesse": "Büromanagement",
  "geschäftsprozesse und kommunikation": "Büromanagement",
  "büromanagementprozesse": "Büromanagement",
  "religionslehre": "Büromanagement",
  "sport": "Büromanagement",
  // Versicherungen und Finanzanlagen
  "sach- und vermögensversicherungen": "Versicherungen und Finanzanlagen",
  "personenversicherungen mit finanzanlagen": "Versicherungen und Finanzanlagen",
  "politik und gesellschaft": "Versicherungen und Finanzanlagen",
  "kaufmännische steuerung und kontrolle": "Versicherungen und Finanzanlagen",
};
