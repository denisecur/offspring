import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import FeatureCard from '../../components/FeatureCard';
import { useNavigate } from 'react-router-dom';
import dashboardData from './dashboardData'; // Import der zusammengeführten Daten
import { getCurrentUser } from '../../helpers';

const AzubiDashboard = () => {
  const navigate = useNavigate();
  
  // getCurrentUser aufrufen, um die Benutzerinformationen zu erhalten
  const currentUser = getCurrentUser();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--color-base-100)',
        py: 0,
        px: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: 'var(--color-neutral)',
              boxShadow: 2,
              borderRadius: 2,
              textAlign: 'left',
            }}
          >
            {/* Beispiel: Benutzerbegrüßung, wenn der Benutzer vorhanden ist */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentUser
                ? `Willkommen, ${currentUser.username} (Ausbildungsstart: ${currentUser.createdAt})!`
                : 'Willkommen, Gast!'}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 1,
                color: 'var(--color-secondary)',
                fontWeight: 'bold',
              }}
            >
              {dashboardData.title}
            </Typography>
            <Typography variant="body1">
              {dashboardData.description}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div onClick={() => handleNavigation('/berichtshefte')} style={{ cursor: 'pointer' }}>
            <FeatureCard
              title="Berichtshefte"
              description="Erstellen und Verwalten deiner wöchentlichen Ausbildungsnachweise."
              image={dashboardData.features[0].image}
              scale={dashboardData.features[0].scale}
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div onClick={() => handleNavigation('/noten')} style={{ cursor: 'pointer' }}>
            <FeatureCard
              title="Notenstand"
              description="Schulnoten speichern und deinen Notendurchschnitt anzeigen."
              image={dashboardData.features[1].image}
              scale={dashboardData.features[1].scale}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AzubiDashboard;
