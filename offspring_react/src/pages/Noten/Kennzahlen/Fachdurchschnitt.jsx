import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'pink',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const calculateAverage = (noten) => {
  const totalWeight = noten.reduce((sum, note) => sum + note.gewichtung, 0);
  const weightedSum = noten.reduce((sum, note) => sum + note.wert * note.gewichtung, 0);
  return (weightedSum / totalWeight).toFixed(2);
};

const Fachdurchschnitt = ({ subject, noten }) => {
  const subjectNoten = noten.filter(note => note.ausbildungsfach?.id === subject.id);
  const average = calculateAverage(subjectNoten);

  const lernfelder = subjectNoten.reduce((acc, note) => {
    if (note.lernfeld) {
      acc[note.lernfeld.id] = acc[note.lernfeld.id] || [];
      acc[note.lernfeld.id].push(note);
    }
    return acc;
  }, {});

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{subject.name}: {average}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Object.keys(lernfelder).map(id => {
          const lernfeldNoten = lernfelder[id];
          const lernfeldAverage = calculateAverage(lernfeldNoten);
          const lernfeldName = lernfeldNoten[0].lernfeld.name;

          return (
            <Accordion key={id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{lernfeldName}: {lernfeldAverage}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {lernfeldNoten.map(note => (
                  <Item key={note.id}>{note.art}: {note.wert} (Datum: {note.datum})</Item>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default Fachdurchschnitt;
