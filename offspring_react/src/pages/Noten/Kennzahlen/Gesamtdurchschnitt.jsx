import React from 'react';
import { Box, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DiameterSymbol } from './DiameterSymbol';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove'; // Neutral icon

const calculateAverage = (noten) => {
  const totalWeight = noten.reduce((sum, note) => sum + note.gewichtung, 0);
  const weightedSum = noten.reduce((sum, note) => sum + note.wert * note.gewichtung, 0);
  return (weightedSum / totalWeight).toFixed(2);
};

const calculateTrend = (noten) => {
  if (noten.length < 2) return null; // Ensure there are at least 2 grades to compare

  const notenWithoutLast = noten.slice(0, -1); // All grades except the last one
  const averageBefore = calculateAverage(notenWithoutLast); // Average before the last grade
  const averageAfter = calculateAverage(noten); // Average including the last grade

  if (averageAfter > averageBefore) return 'up';
  if (averageAfter < averageBefore) return 'down';
  return 'neutral';
};

const TrendArrow = ({ trend }) => {
  if (trend === 'up') {
    return <ArrowUpwardIcon style={{ color: 'green', marginLeft: 4 }} />;
  }
  if (trend === 'down') {
    return <ArrowDownwardIcon style={{ color: 'red', marginLeft: 4 }} />;
  }
  if (trend === 'neutral') {
    return <RemoveIcon style={{ color: 'gray', marginLeft: 4 }} />;
  }
  return null;
};

const Gesamtdurchschnitt = ({ title, noten, showTrend }) => {
  const average = calculateAverage(noten);
  const trend = showTrend ? calculateTrend(noten) : null;

  return (
    <Box>
  <Grid container justifyContent="space-between">
          <div className='text-base font-bold align-start ml-0'>{title}</div>
          <Grid item>
            <Grid container alignItems="center">
            <div className='align-end font-bold'>{DiameterSymbol} {average}</div>
            {trend && <TrendArrow trend={trend} />}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Gesamtdurchschnitt;
