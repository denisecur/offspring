import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import FeatureCard from '../../components/FeatureCard';

// Beispiel-Icons
import berichtshefte from '../../assets/berichtshefte_card_icon.svg';
import noten from '../../assets/noten_card_icon.svg';
import ausbildung from '../../assets/ausbildung_card_icon.svg';

const AzubiDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        // Heller, neutraler Hintergrund
        bgcolor: 'var(--color-base-100)',
        py: 0,         // Vertikaler Abstand (oben/unten)
        px: 2,         // Kleiner seitlicher Puffer für schmale Screens
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          maxWidth: '1200px', // Zentrale maximale Breite
          margin: '0 auto',   // Zentriert
        }}
      >
        {/* Info-Block oben */}
        <Grid item xs={12}>
          <Paper
            // Dezenter Stil: heller Hintergrund, kleiner Schatten, abgerundete Ecken
            sx={{
              p: 4,
              backgroundColor: 'var(--color-neutral)',
              boxShadow: 2,
              borderRadius: 2,
              textAlign: 'left', // Seriös wirkt oft linksbündig
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                color: 'var(--color-secondary)', // Akzentfarbe für Titel
                fontWeight: 'bold',
              }}
            >
              Willkommen im Azubi-Dashboard
            </Typography>
            <Typography variant="body1">
              Verwalte deine schulischen Leistungen und Berichtshefte bequem an
              einem Ort, um stets den Überblick zu behalten. Deine Vorgesetzten
              haben Einsicht in deine Fortschritte und unterstützen dich dabei,
              stets auf dem richtigen Weg zu bleiben.
            </Typography>
          </Paper>
        </Grid>

        {/* FeatureCards: Beispielhaft 3 Stück, 
            je nach Screenbreite 1-3 pro Zeile */}
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Berichtshefte"
            description="Erstellen und Verwalten deiner wöchentlichen Ausbildungsnachweise"
            image={berichtshefte}
            scale={0.8}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Noten"
            description="Schulnoten speichern und deinen Notendurchschnitt anzeigen"
            image={noten}
            scale={0.8}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Ausbildung"
            description="Alle wichtigen Infos zu deiner Ausbildung auf einen Blick"
            image={ausbildung}
            scale={0.8}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AzubiDashboard;
