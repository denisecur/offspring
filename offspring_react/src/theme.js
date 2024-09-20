// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // Behalte die Standardfarben bei
    primary: {
      main: '#E3D026', // Du kannst hier deine bevorzugte Hauptfarbe setzen
      contrastText: '#242105',
      light: '#E9DB5D',
      dark: '#A29415',
    },
    secondary: {
      main: '#453edb',
      light: '#E9DB5D',
      dark: '#A29415',
    },
    // Füge deine benutzerdefinierte Farbe hinzu
    ochre: {
      main: '#E3D026',
      t1: '#453edb',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105',
      switchButton: '#C6E2FF',
      ausgegraut: '#dedede'
    },
  },
  
  // Weitere Theme-Anpassungen (optional)
});

export default theme;
