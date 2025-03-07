// src/components/NotenStand.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
} from "@mui/material";
import GradeRadarChart from "../../../components/Charts/GradeRadarChart";
import LineGraph2 from "../../../components/Dashboard/LineGraph2";

// Hilfsfunktion: Ermittelt das früheste Datum in allen Noten
function getEarliestYear(grades) {
  if (!grades.length) {
    return new Date().getFullYear(); // Fallback: laufendes Jahr
  }
  const minTime = Math.min(...grades.map((g) => new Date(g.datum).getTime()));
  const earliestDate = new Date(minTime);
  let baseYear = earliestDate.getFullYear();
  if (earliestDate.getMonth() < 8) {
    baseYear -= 1;
  }
  return baseYear;
}

// Erzeugt Start- und Enddatum für das n-te Lehrjahr
function getLehrjahrRange(baseYear, n) {
  const start = new Date(baseYear + (n - 1), 8, 1);
  const end = new Date(baseYear + n, 7, 31);
  return { start, end };
}

const NotenStand = ({ grades, faecher }) => {
  // State für ausgewähltes Lehrjahr (0 = alle, 1,2,3)
  const [selectedLehrjahr, setSelectedLehrjahr] = React.useState(0);
  // State für das aktuell per Klick ausgewählte Fach
  const [selectedFachId, setSelectedFachId] = React.useState(null);

  // Durchschnitt berechnen
  const calculateAverage = (gradeArray) => {
    if (gradeArray.length === 0) return "N/A";
    const sum = gradeArray.reduce(
      (total, grade) => total + parseFloat(grade.wert) * grade.gewichtung,
      0
    );
    const totalWeight = gradeArray.reduce(
      (total, grade) => total + parseFloat(grade.gewichtung),
      0
    );
    return (sum / totalWeight).toFixed(2);
  };

  // Bestimme das "Startjahr" aus den Daten
  const baseYear = React.useMemo(() => getEarliestYear(grades), [grades]);

  // Definiere die drei Zeiträume
  const year1 = getLehrjahrRange(baseYear, 1);
  const year2 = getLehrjahrRange(baseYear, 2);
  const year3 = getLehrjahrRange(baseYear, 3);

  // Prüfe, ob in diesem Zeitraum Noten liegen
  const hasYear1 = grades.some((g) => {
    const d = new Date(g.datum);
    return d >= year1.start && d <= year1.end;
  });
  const hasYear2 = grades.some((g) => {
    const d = new Date(g.datum);
    return d >= year2.start && d <= year2.end;
  });
  const hasYear3 = grades.some((g) => {
    const d = new Date(g.datum);
    return d >= year3.start && d <= year3.end;
  });

  // Basierend auf selectedLehrjahr filtern wir die Noten
  const filteredGrades = React.useMemo(() => {
    if (selectedLehrjahr === 1) {
      return grades.filter((g) => {
        const d = new Date(g.datum);
        return d >= year1.start && d <= year1.end;
      });
    } else if (selectedLehrjahr === 2) {
      return grades.filter((g) => {
        const d = new Date(g.datum);
        return d >= year2.start && d <= year2.end;
      });
    } else if (selectedLehrjahr === 3) {
      return grades.filter((g) => {
        const d = new Date(g.datum);
        return d >= year3.start && d <= year3.end;
      });
    }
    return grades;
  }, [grades, selectedLehrjahr, year1, year2, year3]);

  // Gesamtdurchschnitt über alle gefilterten Noten
  const overallAverage = calculateAverage(filteredGrades);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Lehrjahr-Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={selectedLehrjahr === 0 ? "contained" : "outlined"}
          onClick={() => setSelectedLehrjahr(0)}
        >
          Alle
        </Button>
        <Button
          variant={selectedLehrjahr === 1 ? "contained" : "outlined"}
          disabled={!hasYear1}
          onClick={() => setSelectedLehrjahr(1)}
        >
          1
        </Button>
        <Button
          variant={selectedLehrjahr === 2 ? "contained" : "outlined"}
          disabled={!hasYear2}
          onClick={() => setSelectedLehrjahr(2)}
        >
          2
        </Button>
        <Button
          variant={selectedLehrjahr === 3 ? "contained" : "outlined"}
          disabled={!hasYear3}
          onClick={() => setSelectedLehrjahr(3)}
        >
          3
        </Button>
      </Box>

      {/* Grid: Fach-Cards & LineGraph nebeneinander */}
      <Grid container spacing={3}>
        {/* Linke Spalte: Fach-Cards */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {/* Gesamtdurchschnitt-Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  border: `2px solid var(--color-primary)`,
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "var(--color-secondary)",
                      mb: 1,
                    }}
                  >
                    Gesamtdurchschnitt
                    {selectedLehrjahr !== 0 && ` (Jahr ${selectedLehrjahr})`}
                  </Typography>
                  <Typography variant="body" sx={{ fontWeight: "bold" }}>
                    {overallAverage}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Fach-Cards */}
            {faecher.map((fach) => {
              const fachGrades = filteredGrades.filter(
                (grade) => grade.ausbildungsfach?.id === fach.id
              );
              const fachAverage = calculateAverage(fachGrades);

              return (
                <Grid item xs={12} sm={6} md={4} key={fach.id}>
                  <Card
                    onClick={() => setSelectedFachId(fach.id)}
                    sx={{
                      height: "100%",
                      backgroundColor: "background.paper",
                      cursor: "pointer",
                      border:
                        selectedFachId === fach.id
                          ? `2px solid var(--color-primary)`
                          : "none",
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {fach.name}
                      </Typography>
                      <Typography
                        variant="body"
                        sx={{ fontWeight: "bold", color: "primary.main" }}
                      >
                        {fachAverage}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Rechte Spalte: LineGraph */}
        <Grid item xs={12} md={6}>
          {selectedFachId ? (
            <LineGraph2
              grades={filteredGrades.filter(
                (g) => g.ausbildungsfach?.id === selectedFachId
              )}
              subjectName={
                faecher.find((f) => f.id === selectedFachId)?.name || ""
              }
            />
          ) : (
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Bitte wählen Sie ein Fach aus, um den Notendurchschnitt anzuzeigen.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Radar-Chart (optional, falls weiterhin gewünscht) */}
      <Box sx={{ mt: 4 }}>
        <GradeRadarChart grades={filteredGrades} faecher={faecher} />
      </Box>
    </Box>
  );
};

export default NotenStand;
