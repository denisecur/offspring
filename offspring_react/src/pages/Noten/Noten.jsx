import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Kennzahlen from './Kennzahlen';
import AddNote from './AddNote';
import Termine from './Termine';
import NotenDetails from './NotenDetails'
import NotenList from './NotenList';

import { noten } from '../../api/testdaten/noten';


const NotenPage = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Grid
            container
            spacing={2.5}
            direction="row"
            justifyContent="space-evenly"
            alignItems="baseline" 
          >
            <Grid item xs={12} sm={6} md={6}>
              <Kennzahlen noten={noten} />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <AddNote />
            </Grid>
          </Grid>
        </Box>
  
        <Box sx={{ mb: 3 }}>
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
  
        <Box sx={{ mb: 3 }}>
          <Grid
            container
            spacing={2.5}
            direction="row"
            justifyContent="space-evenly"
            alignItems="baseline"
          >
            <Grid item xs={12} sm={12} md={12}>
              <NotenList noten={noten} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };
  
  export default NotenPage;