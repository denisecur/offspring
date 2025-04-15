import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const FeatureCard = ({ title, description, image, scale }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
        borderRadius: 3,
        boxShadow: 6,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 8,
        },
        height: '350px', // Erhöhte Höhe für größere Bilder
        width: '100%',
      }}
    >
      {/* Bild */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1, // Mehr Platz für das Bild
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            transform: `scale(${scale ?? 1})`,
            maxHeight: '200px', // Größere Bildhöhe
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Textinhalt */}
      <CardContent
        sx={{
          width: '100%',
          flexGrow: 0,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;