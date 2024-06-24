import Gesamtdurchschnitt from './Kennzahlen/Gesamtdurchschnitt';
import FachKategorie from './Kennzahlen/FachKategorie';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';



const Kennzahlen = ({ noten }) => {
  const allgemeinbildend = noten.filter(note => note.ausbildungsfach?.fachrichtung === 'beide');
  const fachlich = noten.filter(note => note.ausbildungsfach && note.ausbildungsfach.fachrichtung !== 'beide');

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'pink',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3), // Add margin to separate from the rest
  }));

  return (
    <div>
      <Item>
      <Gesamtdurchschnitt noten={noten} />
      <FachKategorie title="Fachlicher Unterricht" noten={fachlich} />
      <FachKategorie title="Allgemeinbildender Unterricht" noten={allgemeinbildend} />
      </Item>
    </div>
  );
};

export default Kennzahlen;
