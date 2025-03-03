import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const FeatureCard = ({ title, description, image, scale }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      {/* Linke Box für das Bild */}
      <Box
        sx={{
          width: '33%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image}
          alt={title}
          style={{ transform: `scale(${scale ?? 1})`, height: "200px" }}
        />
      </Box>

      {/* Rechte Box für Text */}
      <CardContent sx={{ width: '67%' }}>
        <Typography variant="h6" gutterBottom>
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
