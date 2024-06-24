import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fachdurchschnitt from './Fachdurchschnitt';

const getUniqueSubjects = (noten) => {
  const subjectsMap = {};
  noten.forEach(note => {
    if (note.ausbildungsfach) {
      subjectsMap[note.ausbildungsfach.id] = note.ausbildungsfach;
    }
  });
  return Object.values(subjectsMap);
};

const FachKategorie = ({ title, noten }) => {
  const uniqueSubjects = getUniqueSubjects(noten);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {uniqueSubjects.map(subject => (
          <Fachdurchschnitt key={subject.id} subject={subject} noten={noten} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default FachKategorie;
