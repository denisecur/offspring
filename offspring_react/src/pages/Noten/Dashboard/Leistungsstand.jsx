import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import GradeRadarChart from "../../../components/Charts/GradeRadarChart";
import LineGraph2 from "../../../components/Dashboard/LineGraph2";
import { calculateAverage } from "../../../api_services/noten/calculations";
import GradeTableWithCharts from "./GradeTableWithCharts";

function getEarliestYear(grades) {
  if (!grades.length) return new Date().getFullYear();
  const earliestDate = new Date(
    Math.min(...grades.map((g) => new Date(g.datum).getTime()))
  );
  return earliestDate.getMonth() < 8
    ? earliestDate.getFullYear() - 1
    : earliestDate.getFullYear();
}

function getLehrjahrRange(baseYear, n) {
  return {
    start: new Date(baseYear + n - 1, 8, 1),
    end: new Date(baseYear + n, 7, 31),
  };
}

export default function Leistungsstand({ grades, faecher, azubi }) {
  const [selectedLehrjahr, setSelectedLehrjahr] = useState(0);
  const [selectedFachId, setSelectedFachId] = useState(null);
  const [selectedFachType, setSelectedFachType] = useState("fachlich");

  // Noten nur für den gewählten Azubi
  const relevantGrades = useMemo(() => {
    if (!azubi) return grades;
    return grades.filter((g) => g.owner && g.owner.id === azubi.id);
  }, [grades, azubi]);

  // Basisjahr
  const baseYear = useMemo(() => getEarliestYear(relevantGrades), [relevantGrades]);

  // Lehrjahr-Bereiche
  const yearRanges = useMemo(
    () => [1, 2, 3].map((n) => getLehrjahrRange(baseYear, n)),
    [baseYear]
  );

  // Nach Lehrjahr filtern
  const filteredGrades = useMemo(() => {
    if (selectedLehrjahr === 0) return relevantGrades;
    const { start, end } = yearRanges[selectedLehrjahr - 1];
    return relevantGrades.filter((g) => {
      const d = new Date(g.datum);
      return d >= start && d <= end;
    });
  }, [relevantGrades, selectedLehrjahr, yearRanges]);

  // Gesamtdurchschnitt
  const overallAverage = calculateAverage(filteredGrades);

  // Fächer deduplizieren, ggf. nach Ausbildungsrichtung
  const uniqueFaecher = useMemo(() => {
    const map = new Map();
    faecher.forEach((fach) => {
      if (
        azubi &&
        fach.ausbildungsrichtung &&
        fach.ausbildungsrichtung !== azubi.fachrichtung
      ) {
        return;
      }
      if (!map.has(fach.id)) map.set(fach.id, fach);
    });
    return Array.from(map.values());
  }, [faecher, azubi]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, bgcolor:"white" }}>
      {/* Titel */}
      <Typography variant="h5" fontWeight="bold">
        Leistungsstand
      </Typography>

      {/* Auswahl-Bereiche: Fachtyp & Lehrjahr */}
      <Grid container spacing={2}>
        {azubi && (
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Fachtyp auswählen
            </Typography>
            <ToggleButtonGroup
              value={selectedFachType}
              exclusive
              onChange={(e, val) => {
                if (val !== null) setSelectedFachType(val);
              }}
              size="small"
              fullWidth
            >
              <ToggleButton value="fachlich">Fachlich</ToggleButton>
              <ToggleButton value="allgemein">Allgemein</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        )}

        <Grid item xs={12} md={azubi ? 8 : 12}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Lehrjahr auswählen
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[0, 1, 2, 3].map((year) => (
              <Button
                key={year}
                variant={selectedLehrjahr === year ? "contained" : "outlined"}
                onClick={() => setSelectedLehrjahr(year)}
              >
                {year === 0 ? "Alle" : `Jahr ${year}`}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Divider />

      {/* Durchschnitt & Liniendiagramm */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Durchschnitt
          </Typography>
          <List
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            {/* Gesamtdurchschnitt */}
            <ListItem
              button
              onClick={() => setSelectedFachId(null)}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <ListItemText
                primary="Gesamtdurchschnitt"
                secondary={overallAverage}
              />
            </ListItem>

            {/* Fächer-Liste */}
            {uniqueFaecher
              .filter(
                (fach) =>
                  fach.isFachlichesFach === (selectedFachType === "fachlich")
              )
              .map((fach) => {
                const fachGrades = filteredGrades.filter(
                  (g) => g.ausbildungsfach?.id === fach.id
                );
                const fachAverage = calculateAverage(fachGrades);

                return (
                  <ListItem
                    key={fach.id}
                    button
                    onClick={() => setSelectedFachId(fach.id)}
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ListItemText
                      primary={fach.name}
                      secondary={fachAverage}
                    />
                  </ListItem>
                );
              })}
          </List>
        </Grid>

        <Grid item xs={12} md={8}>
          <LineGraph2
            grades={filteredGrades.filter(
              (g) =>
                !selectedFachId || g.ausbildungsfach?.id === selectedFachId
            )}
            subjectName={
              selectedFachId
                ? uniqueFaecher.find((f) => f.id === selectedFachId)?.name
                : "Gesamtdurchschnitt"
            }
          />
        </Grid>
      </Grid>

      <Divider />

      {/* Radar-Diagramm */}
      <GradeRadarChart grades={filteredGrades} faecher={uniqueFaecher} />

      <Divider />

      {/* Abschließende Tabelle */}
      <GradeTableWithCharts grades={filteredGrades} />
    </Box>
  );
}
