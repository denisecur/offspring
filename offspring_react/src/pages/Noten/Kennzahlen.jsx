import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Fachdurchschnitt from './Kennzahlen/Fachdurchschnitt';
import { calculateAverage, calculateTrend } from './../../utils/utils';

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

const FachKategorie = ({ title, noten, showTrend, expandable }) => {
  const getUniqueSubjects = (noten) => {
    const subjectsMap = {};
    noten.forEach(note => {
      if (note.ausbildungsfach) {
        subjectsMap[note.ausbildungsfach.id] = note.ausbildungsfach;
      }
    });
    return Object.values(subjectsMap);
  };

  const uniqueSubjects = getUniqueSubjects(noten);
  const overallAverage = calculateAverage(noten);
  const overallTrend = showTrend ? calculateTrend(noten) : null;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container justifyContent="space-between" alignItems="center">
          <div className='text-base'>{title}</div>
          <Grid item>
            <Grid container alignItems="center">
              <Typography variant="body1">Ø {overallAverage}</Typography>
              {overallTrend && <TrendArrow trend={overallTrend} />}
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {uniqueSubjects.map(subject => (
          expandable ? (
            <Fachdurchschnitt key={subject.id} subject={subject} noten={noten} showTrend={showTrend} expandable={expandable} />
          ) : (
            <Grid container justifyContent="space-between" alignItems="center" key={subject.id} style={{ marginBottom: '1em' }}>
              <Grid item>
                <Typography variant="body1">{subject.name}</Typography>
              </Grid>
              <Grid item>
                <Fachdurchschnitt subject={subject} noten={noten} showTrend={showTrend} expandable={expandable} />
              </Grid>
            </Grid>
          )
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default FachKategorie;
