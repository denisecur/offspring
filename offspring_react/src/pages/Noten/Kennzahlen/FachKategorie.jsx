import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Fachdurchschnitt from './Fachdurchschnitt';

const FachKategorie = ({ title, noten, showTrend, expandable }) => {
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
