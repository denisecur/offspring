import React, { useState } from 'react';
import Gesamtdurchschnitt from './Kennzahlen/Gesamtdurchschnitt';
import FachKategorie from './Kennzahlen/FachKategorie';
import { Card, Grid, Typography, Switch, Box } from '@mui/material';
import { calculateAverage, calculateTrend } from './../../utils/utils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove'; // Neutral icon

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

const Kennzahlen = ({ noten }) => {
  const [showTrend, setShowTrend] = useState(true);

  const handleShowTrendToggle = () => setShowTrend(!showTrend);

  const allgemeinbildend = noten.filter(note => note.ausbildungsfach?.fachrichtung === 'beide');
  const fachlich = noten.filter(note => note.ausbildungsfach && note.ausbildungsfach.fachrichtung !== 'beide');

  const allgemeinbildendAverage = calculateAverage(allgemeinbildend);
  const fachlichAverage = calculateAverage(fachlich);

  const allgemeinbildendTrend = showTrend ? calculateTrend(allgemeinbildend) : null;
  const fachlichTrend = showTrend ? calculateTrend(fachlich) : null;

  return (
    <Card>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid item>
          <div className='text-xl'>Kennzahlen</div>
        </Grid>
        <Grid item>
          <Typography gutterBottom><ArrowUpwardIcon style={{ color: 'green'}}/><ArrowDownwardIcon style={{ color: 'red'}} /><Switch checked={showTrend} onChange={handleShowTrendToggle} /></Typography>
          
        </Grid>
      </Grid>
      
      <Box padding={2}>
      <Card className='p-6 items-start'>
        <Gesamtdurchschnitt title="Gesamtdurchschnitt" noten={noten} showTrend={showTrend} />
      </Card>
        <Grid container justifyContent="space-between" alignItems="center">
         
        </Grid>
        <FachKategorie title="Fachlicher Unterricht" noten={fachlich} showTrend={showTrend} expandable={false} />
        <Grid container justifyContent="space-between" alignItems="center">
       
        </Grid>
        <FachKategorie title="Allgemeinbildender Unterricht" noten={allgemeinbildend} showTrend={showTrend} expandable={false} />
      </Box>
    </Card>
  );
};

export default Kennzahlen;
