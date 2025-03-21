import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import FeatureCard from '../../components/FeatureCard';
import { useNavigate } from 'react-router-dom';
import dashboardData from './dashboardData'; // Import der zusammengeführten Daten

export default function ChefDashboard() {
  const navigate = useNavigate();

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
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                color: 'var(--color-secondary)',
                fontWeight: 'bold',
              }}
            >
              {dashboardData.chefTitle}
            </Typography>
            <Typography variant="body1">
              {dashboardData.chefDescription}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <div onClick={() => handleNavigation('/profile')} style={{ cursor: 'pointer' }}>
            <FeatureCard
              title={dashboardData.chefFeatures[0].title}
              description={dashboardData.chefFeatures[0].description}
              image={dashboardData.chefFeatures[0].image}
              scale={dashboardData.chefFeatures[0].scale}
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <div onClick={() => handleNavigation('/ranking')} style={{ cursor: 'pointer' }}>
            <FeatureCard
              title={dashboardData.chefFeatures[1].title}
              description={dashboardData.chefFeatures[1].description}
              image={dashboardData.chefFeatures[1].image}
              scale={dashboardData.chefFeatures[1].scale}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
