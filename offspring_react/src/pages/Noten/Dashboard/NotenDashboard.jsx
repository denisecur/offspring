import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { BarChart, TableChart } from '@mui/icons-material';
import { useTheme } from "@mui/material/styles";
import { getSchoolYear, calculateAverage, calculateAverageByFach, calculateAverageBySchuljahr } from "../../../api/noten/calculations";

const getGradeColor = (value) => {
  if (!value || value === "Keine Daten") return "gray";
  const numValue = parseFloat(value);
  if (numValue <= 1.5) return "green";
  if (numValue >= 4) return "red";
  return "orange";
};

const NotenDashboard = ({ grades }) => {
  const theme = useTheme();
  const schuljahrs = [...new Set(grades.map((grade) => getSchoolYear(grade.datum)))];
  const fachs = [...new Set(grades.map((grade) => grade.ausbildungsfach.name))];
  const [selectedYears, setSelectedYears] = useState(schuljahrs);
  const [viewMode, setViewMode] = useState('overview');

  const handleYearChange = (event) => {
    const { value } = event.target;
    setSelectedYears(typeof value === 'string' ? value.split(',') : value);
  };

  const handleViewModeChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const filteredGrades = grades.filter((grade) =>
    selectedYears.includes(getSchoolYear(grade.datum))
  );

  const totalAverage = calculateAverage(filteredGrades);

  return (
    <Box sx={{ padding: 3, background: `linear-gradient(135deg, ${theme.palette.neutral} 10%, ${theme.palette.primary.main} 90%)`, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="jahr-label">Jahr</InputLabel>
          <Select
            labelId="jahr-label"
            multiple
            value={selectedYears}
            onChange={handleYearChange}
            input={<OutlinedInput label="Jahr" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {schuljahrs.map((jahr) => (
              <MenuItem key={jahr} value={jahr}>
                <Checkbox checked={selectedYears.indexOf(jahr) > -1} />
                <ListItemText primary={jahr} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="Ansichtsauswahl"
          sx={{ ml: 'auto' }}
        >
          <ToggleButton value="overview" aria-label="Übersicht">
            <BarChart /> Übersicht
          </ToggleButton>
          <ToggleButton value="fach" aria-label="Fächer">
            <TableChart /> Fächer
          </ToggleButton>
          <ToggleButton value="jahr" aria-label="Jahre">
            <TableChart /> Jahre
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'overview' && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Card sx={{ textAlign: 'center', height: '100%', border: `2px solid ${theme.palette.accent}`, backgroundColor: theme.palette.background.paper, boxShadow: `0px 0px 15px ${theme.palette.accent}` }}>
              <CardContent>
                <Typography variant="h6">Aktueller Gesamtdurchschnitt</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {totalAverage || 'Keine Daten'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {fachs.map((fach) => (
            <Grid item xs={12} sm={4} md={3} key={fach}>
              <Card sx={{ textAlign: 'center', height: '100%', border: `2px solid ${theme.palette.accent}`, backgroundColor: theme.palette.background.paper, boxShadow: `0px 0px 15px ${theme.palette.accent}` }}>
                <CardContent>
                  <Typography variant="h6" noWrap>{fach}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Durchschnittsnote
                  </Typography>
                  <Typography variant="h5" sx={{ color: getGradeColor(calculateAverageByFach(filteredGrades, fach)) }}>
                    {calculateAverageByFach(filteredGrades, fach) || 'Keine Daten'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {viewMode === 'fach' && (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fach</TableCell>
                <TableCell>Durchschnittsnote</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fachs.map((fach) => (
                <TableRow key={fach}>
                  <TableCell>{fach}</TableCell>
                  <TableCell>{calculateAverageByFach(filteredGrades, fach) || 'Keine Daten'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default NotenDashboard;
