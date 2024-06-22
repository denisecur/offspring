import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Kennzahlen from './ui/Kennzahlen';
import NoteHinzufuegen from './ui/AddNote';
import NotenDetails from './ui/NotenDetails';
import Termine from './ui/Termine';


const NotenPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}> {/* Add margin-bottom for spacing between grids */}
        <Grid
          container
          spacing={2.5}
          direction="row"
          justifyContent="space-evenly"
          alignItems="baseline"
        >
          <Grid item xs={12} sm={6} md={6}>
            <Kennzahlen />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <NoteHinzufuegen />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}> {/* Add margin-bottom for spacing between grids */}
        <Grid
          container
          spacing={2.5}
          direction="row"
          justifyContent="space-evenly"
          alignItems="baseline"
        >
          <Grid item xs={12} sm={6} md={6}>
            <NotenDetails />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Termine />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NotenPage;
