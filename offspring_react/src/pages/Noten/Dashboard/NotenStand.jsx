// src/components/NotenStand.jsx
import React, { useMemo, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import GradeRadarChart from "../../../components/Charts/GradeRadarChart";
import LineGraph2 from "../../../components/Dashboard/LineGraph2";
import { calculateAverage } from "../../../api_services/noten/calculations";
import GradeTableWithCharts from "./GradeTableWithCharts";

const getEarliestYear = (grades) => {
  if (!grades.length) return new Date().getFullYear();
  const earliestDate = new Date(Math.min(...grades.map((g) => new Date(g.datum).getTime())));
  return earliestDate.getMonth() < 8 ? earliestDate.getFullYear() - 1 : earliestDate.getFullYear();
};

const getLehrjahrRange = (baseYear, n) => ({
  start: new Date(baseYear + n - 1, 8, 1),
  end: new Date(baseYear + n, 7, 31),
});

const NotenStand = ({ grades, faecher, azubi }) => {
  const [selectedLehrjahr, setSelectedLehrjahr] = useState(0);
  const [selectedFachId, setSelectedFachId] = useState(null);

  // Falls ein Azubi übergeben wurde, filtere die Noten entsprechend,
  // ansonsten verwende die übergebenen Noten (alte Funktionalität)
  const relevantGrades = useMemo(() => {
    if (azubi) {
      return grades.filter((g) => g.owner && g.owner.id === azubi.id);
    }
    return grades;
  }, [grades, azubi]);

  const baseYear = useMemo(() => getEarliestYear(relevantGrades), [relevantGrades]);
  const yearRanges = useMemo(
    () => [1, 2, 3].map((n) => getLehrjahrRange(baseYear, n)),
    [baseYear]
  );

  // Filtere die Noten nach Lehrjahr
  const filteredGrades = useMemo(() => {
    if (selectedLehrjahr === 0) return relevantGrades;
    const { start, end } = yearRanges[selectedLehrjahr - 1];
    return relevantGrades.filter(
      (g) => new Date(g.datum) >= start && new Date(g.datum) <= end
    );
  }, [relevantGrades, selectedLehrjahr, yearRanges]);

  const overallAverage = calculateAverage(filteredGrades);

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {[0, 1, 2, 3].map((year) => (
          <Button
            key={year}
            variant={selectedLehrjahr === year ? "contained" : "outlined"}
            disabled={
              yearRanges[year - 1] &&
              !relevantGrades.some((g) => {
                const d = new Date(g.datum);
                const range = yearRanges[year - 1];
                return d >= range.start && d <= range.end;
              })
            }
            onClick={() => setSelectedLehrjahr(year)}
          >
            {year === 0 ? "Alle" : year}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                onClick={() => setSelectedFachId(null)}
                sx={{
                  cursor: "pointer",
                  border:
                    selectedFachId === null
                      ? "2px solid var(--color-primary)"
                      : "none",
                }}
              >
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                    Gesamtdurchschnitt
                    {selectedLehrjahr !== 0 && ` (Jahr ${selectedLehrjahr})`}
                  </Typography>
                  <Typography variant="body" sx={{ fontWeight: "bold" }}>
                    {overallAverage}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

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
                      cursor: "pointer",
                      border:
                        selectedFachId === fach.id
                          ? "2px solid var(--color-primary)"
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

        <Grid item xs={6} md={6}>
          <LineGraph2
            grades={filteredGrades.filter(
              (g) => !selectedFachId || g.ausbildungsfach?.id === selectedFachId
            )}
            subjectName={
              selectedFachId
                ? faecher.find((f) => f.id === selectedFachId)?.name
                : "Gesamtdurchschnitt"
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <GradeRadarChart grades={filteredGrades} faecher={faecher} />
      </Box>
      <GradeTableWithCharts grades={filteredGrades} />
    </Box>
  );
};

export default NotenStand;
