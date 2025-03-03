import React from 'react';
import { Grid, Paper, Card, CardContent, Typography, Box, Button } from '@mui/material';
import CompetitiveComparisonBarChart from './CompetitiveComparisonBarChart';
// Entferne den Import von Leaderboard, da wir unsere eigene lokale Komponente verwenden
import Leaderboard from './Leaderboard';

// Platzhalter-Komponente für Leaderboard / Rangliste
const LeaderboardPlaceholder = ({ allGrades, faecher }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6">Leaderboard</Typography>
      <Typography variant="body2">
        [Hier erscheint eine Rangliste der Top-Performer pro Fach oder insgesamt.]
      </Typography>
      {/* Hier könntest du später die tatsächliche Leaderboard-Komponente rendern */}
      { <Leaderboard allGrades={allGrades} faecher={faecher} /> }
    </CardContent>
  </Card>
);

// Platzhalter für Summary Cards (Kennzahlen-Kacheln)
const SummaryCards = () => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1">Gesamt-Durchschnitt</Typography>
          <Typography variant="h5">--</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1">Top Azubi</Typography>
          <Typography variant="h5">--</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1">Verbesserung</Typography>
          <Typography variant="h5">--</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1">Bewertungen</Typography>
          <Typography variant="h5">--</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Platzhalter für Trend-Analyse (z. B. Liniendiagramm oder Indikatoren)
const TrendAnalysis = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>Trend Analysis</Typography>
    <Typography variant="body2">
      [Leistungsentwicklung im Zeitverlauf – z. B. Verbesserungen oder Verschlechterungen]
    </Typography>
  </Paper>
);

// Platzhalter für eine Heatmap (matrix-artige Darstellung der Fächerleistungen)
const HeatmapOverview = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>Heatmap</Typography>
    <Typography variant="body2">
      [Farbkodierte Übersicht, in welchen Fächern die Leistungen besonders gut oder verbesserungsbedürftig sind]
    </Typography>
  </Paper>
);

// Platzhalter für automatisierte Kommentare / Zusammenfassungen
const AutomatedComments = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>Automatisierte Zusammenfassung</Typography>
    <Typography variant="body2">
      [Basierend auf den Kennzahlen: Hier könnten Kommentare stehen, wie "Azubi X ist in Mathe Spitzenreiter, in Deutsch besteht Verbesserungspotenzial."]
    </Typography>
  </Paper>
);

// Platzhalter für interaktive Filter
const InteractiveFilters = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>Interaktive Filter</Typography>
    <Typography variant="body2">
      [Hier können Filter für Zeitraum, Fachrichtung, etc. integriert werden.]
    </Typography>
    <Box sx={{ mt: 1 }}>
      <Button variant="contained">Filter anwenden</Button>
    </Box>
  </Paper>
);

const CompetitiveOverview = ({ allGrades, faecher }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Wettbewerbs-Übersicht
      </Typography>
      
      {/* Interaktive Filter */}
      <InteractiveFilters />

      {/* Summary Cards */}
      <SummaryCards />

      {/* Leaderboard */}
      <LeaderboardPlaceholder allGrades={allGrades} faecher={faecher} />

      {/* Trend Analyse */}
      <TrendAnalysis />

      {/* Heatmap */}
      <HeatmapOverview />

      {/* Automatisierte Kommentare */}
      <AutomatedComments />

      {/* Vergleichs-Chart (Balkendiagramm) */}
      <CompetitiveComparisonBarChart allGrades={allGrades} faecher={faecher} />
    </Box>
  );
};

export default CompetitiveOverview;
