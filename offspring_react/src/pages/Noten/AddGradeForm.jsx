import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTheme } from "@mui/material/styles";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { addUserGrade } from '../../api_services/noten/notenService';

// Hilfsfunktion: Konvertiert Ausbildungsjahr und Halbjahr in ein fiktives Datum (als UTC)
const convertOldNoteDate = (ausbildungsjahr, halbjahr) => {
  const baseYear = 2000; // Basisjahr (anpassbar)
  const computedYear = baseYear + (Number(ausbildungsjahr) - 1);
  if (Number(halbjahr) === 1) {
    // Für Halbjahr 1: 01.09. des entsprechenden Jahres (UTC)
    return new Date(Date.UTC(computedYear, 8, 1)).toISOString();
  } else {
    // Für Halbjahr 2: 01.03. des Folgejahres (UTC)
    return new Date(Date.UTC(computedYear + 1, 2, 1)).toISOString();
  }
};

const AddGradeForm = ({ faecher, leistungsnachweise, onAddGrade }) => {
  const theme = useTheme();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOldNote, setIsOldNote] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Bei älteren Noten wird das Datum anhand Ausbildungsjahr und Halbjahr berechnet
      const datum = isOldNote
        ? convertOldNoteDate(data.Ausbildungsjahr, data.Halbjahr)
        : (selectedDate ? selectedDate.toISOString() : null);
      
      const gradeData = {
        datum,
        wert: data.Note,
        art: data.Art,
        ausbildungsfach: data.Fach,
      };

      console.log({ gradeData });
      const response = await addUserGrade(gradeData);
      if (response && response.data) {
        console.log('Note erfolgreich hinzugefügt', response.data);
        setOpenSnackbar(true);
        if (onAddGrade) onAddGrade(response.data);
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Note:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        p: 1,
        boxSizing: 'border-box',
      }}
      noValidate
      autoComplete="off"
    >

      {/* Checkbox für "Ältere Note?" */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isOldNote}
            onChange={(e) => setIsOldNote(e.target.checked)}
          />
        }
        label="Ältere Note? (vor Veröffentlichung der App)"
        sx={{ mb: 1 }}
      />

      {/* Grid-Layout: Zwei Zeilen */}
      <Grid container spacing={2}>
        {/* Erste Zeile: Fach und Note */}
        <Grid item xs={8}>
          <FormControl fullWidth error={Boolean(errors.Fach)}>
            <InputLabel id="fach-label">Fach</InputLabel>
            <Select
              labelId="fach-label"
              id="fach-select"  size="small"
              label="Fach"
              defaultValue=""
              {...register('Fach', { required: 'Bitte wählen Sie ein Fach aus' })}
            >
              {faecher.map((fach) => (
                <MenuItem key={fach.id} value={fach.id}>
                  {fach.name}
                </MenuItem>
              ))}
            </Select>
            {errors.Fach && <FormHelperText>{errors.Fach.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            size="small"
            label="Note"
            type="number"
            inputProps={{ step: 0.1, min: 0, max: 6 }}
            fullWidth
            error={Boolean(errors.Note)}
            helperText={errors.Note ? errors.Note.message : ''}
            {...register('Note', {
              required: 'Bitte geben Sie eine Note ein',
              min: { value: 0, message: 'Die Note muss mindestens 0 sein' },
              max: { value: 6, message: 'Die Note darf höchstens 6 sein' },
            })}
          />
        </Grid>

        {/* Zweite Zeile: Art des Leistungsnachweises und Datum bzw. ältere Note Felder */}
        <Grid item xs={8}>
          <FormControl fullWidth error={Boolean(errors.Art)}>
            <InputLabel id="art-label">Art des Leistungsnachweises</InputLabel>
            <Select
              labelId="art-label"
              id="art-select"
                size="small"
              label="Art des Leistungsnachweises"
              defaultValue=""
              {...register('Art', { required: 'Bitte wählen Sie die Art aus' })}
            >
              {leistungsnachweise.map((ln) => (
                <MenuItem key={ln.id} value={ln.art}>
                  {ln.art}
                </MenuItem>
              ))}
            </Select>
            {errors.Art && <FormHelperText>{errors.Art.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          {isOldNote ? (
            // Wenn "Ältere Note" aktiviert ist, zeigen wir zwei Felder (Ausbildungsjahr und Halbjahr) in einem inneren Grid
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormControl fullWidth error={Boolean(errors.Ausbildungsjahr)}>
                  <InputLabel id="ausbildungsjahr-label">Jahr</InputLabel>
                  <Select
                    labelId="ausbildungsjahr-label"
                    id="ausbildungsjahr-select"
                    label="Jahr"
                    defaultValue=""
                    {...register('Ausbildungsjahr', { required: 'Bitte wählen Sie ein Ausbildungsjahr aus' })}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
                  {errors.Ausbildungsjahr && <FormHelperText>{errors.Ausbildungsjahr.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth error={Boolean(errors.Halbjahr)}>
                  <InputLabel id="halbjahr-label">Halbjahr</InputLabel>
                  <Select
                    labelId="halbjahr-label"
                    id="halbjahr-select"
                    label="Halbjahr"
                    defaultValue=""
                    {...register('Halbjahr', { required: 'Bitte wählen Sie ein Halbjahr aus' })}
                  >
                    <MenuItem value="1">1.</MenuItem>
                    <MenuItem value="2">2.</MenuItem>
                  </Select>
                  {errors.Halbjahr && <FormHelperText>{errors.Halbjahr.message}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          ) : (
            // Andernfalls: Datumsauswahl (gleich breit wie Note)
            <FormControl fullWidth error={Boolean(errors.Datum)}>
              <Controller
                control={control}
                name="Datum"
                rules={{ required: 'Bitte wählen Sie ein Datum aus' }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Datum auswählen"
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      field.onChange(date);
                    }}
                    dateFormat="dd.MM.yyyy"
                    customInput={
                      <TextField
                        label="Datum"
                        fullWidth
                          size="small"
                        error={Boolean(errors.Datum)}
                        helperText={errors.Datum ? errors.Datum.message : ''}
                      />
                    }
                  />
                )}
              />
            </FormControl>
          )}
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Note hinzufügen
        </Button>
      </Box>

      {/* Erfolgsmeldung */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Note erfolgreich hinzugefügt!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddGradeForm;
