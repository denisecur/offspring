// src/pages/Noten/Dashboard/CompetitiveOverview.jsx
import React from 'react';
import { Grid, Paper, Card, CardContent, Typography, Box, Button } from '@mui/material';
import CompetitiveComparisonBarChart from './CompetitiveComparisonBarChart';
import CompetitiveComparison from './CompetitiveComparison';
// Dummy-Berechnungen für Summary Cards (Kennzahlen-Kacheln)
const SummaryCards = ({ allGrades }) => {
  // Beispiel: Gesamt-Durchschnitt berechnen (hier als Dummy)
  const overallAverage = allGrades.length
    ? (allGrades.reduce((sum, grade) => sum + parseFloat(grade.value || 0), 0) / allGrades.length).toFixed(2)
    : '--';
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">Gesamt-Durchschnitt</Typography>
            <Typography variant="h5">{overallAverage}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">Top Azubi</Typography>
            <Typography variant="h5">Azubi A</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">Verbesserung</Typography>
            <Typography variant="h5">+0.5</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">Bewertungen</Typography>
            <Typography variant="h5">4.2</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const TrendAnalysis = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      Trend Analysis
    </Typography>
    <Typography variant="body2">
      [Hier könnte ein Liniendiagramm die Leistungsentwicklung darstellen.]
    </Typography>
  </Paper>
);

const HeatmapOverview = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      Heatmap
    </Typography>
    <Typography variant="body2">
      [Farbkodierte Übersicht: In welchen Fächern sind Leistungen besonders stark oder schwach?]
    </Typography>
  </Paper>
);

const AutomatedComments = () => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      Automatisierte Zusammenfassung
    </Typography>
    <Typography variant="body2">
      [Basierend auf den Kennzahlen: z. B. "Azubi xyz ist in Mathe Spitzenreiter, in Deutsch besteht Verbesserungspotenzial."]
    </Typography>
  </Paper>
);



const CompetitiveOverview = ({ allGrades, faecher }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Wettbewerbs-Übersicht
      </Typography>
      <SummaryCards allGrades={allGrades} />
 
      <TrendAnalysis />
      <HeatmapOverview />
      <AutomatedComments />
      <CompetitiveComparisonBarChart allGrades={allGrades} faecher={faecher} />
      <CompetitiveComparison allGrades={allGrades} faecher={faecher} />
   
    </Box>
  );
};

export default CompetitiveOverview;
