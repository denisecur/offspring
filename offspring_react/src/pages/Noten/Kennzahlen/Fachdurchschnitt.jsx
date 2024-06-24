import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove'; // Neutral icon
import { calculateAverage, calculateTrend } from './../../../utils/utils'; // Assuming these functions are moved to a utils file

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'pink',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

const Fachdurchschnitt = ({ subject, noten, showTrend, expandable }) => {
  const subjectNoten = noten.filter(note => note.ausbildungsfach?.id === subject.id);
  const average = calculateAverage(subjectNoten);
  const trend = showTrend ? calculateTrend(subjectNoten) : null;

  if (!expandable) {
    return (
      <Grid container alignItems="center">
        <Typography variant="body1">Ø {average}</Typography>
        {trend && <TrendArrow trend={trend} />}
      </Grid>
    );
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography>{subject.name}</Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Typography>Ø {average}</Typography>
              {trend && <TrendArrow trend={trend} />}
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
    </Accordion>
  );
};

export default Fachdurchschnitt;
