import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DiameterSymbol } from './DiameterSymbol';

const Gesamtdurchschnitt = ({ noten }) => {
  const totalWeight = noten.reduce((sum, note) => sum + note.gewichtung, 0);
  const weightedSum = noten.reduce((sum, note) => sum + note.wert * note.gewichtung, 0);
  const average = (weightedSum / totalWeight).toFixed(2);

  return (
    <div>
      <Typography variant="h6">Gesamt: {DiameterSymbol} {average}</Typography>
    </div>
  );
};

export default Gesamtdurchschnitt;
