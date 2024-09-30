import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
} from '@mui/material';
import { addUserGrade } from '../../api/noten/notenService';

const AddGradeForm = ({ faecher, leistungsnachweise, onAddGrade }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [selectedDate, setSelectedDate] = useState(null);

  const onSubmit = async (data) => {
    try {
      const gradeData = {
        datum: selectedDate ? selectedDate.toISOString() : null,
        wert: data.Note,
        art: data.Art,
        ausbildungsfach: data.Fach,
      };

      console.log({ gradeData });

      const response = await addUserGrade(gradeData);

      if (response && response.data) {
        console.log('Note erfolgreich hinzugefügt', response.data);
        if (onAddGrade) {
          onAddGrade(response.data);
        }
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
        '& .MuiTextField-root': { m: 1, width: '100%' },
        maxWidth: 500,
        mx: 'auto',
        p: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 3,
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        Neue Note hinzufügen
      </Typography>

      {/* Fach Auswahl */}
      <FormControl
        fullWidth
        margin="normal"
        error={Boolean(errors.Fach)}
        sx={{ m: 1 }}
      >
        <InputLabel id="fach-label">Fach</InputLabel>
        <Select
          labelId="fach-label"
          id="fach-select"
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

      {/* Note Eingabe */}
      <TextField
        label="Note"
        type="number"
        inputProps={{ step: 0.1, min: 0, max: 6 }}
        fullWidth
        margin="normal"
        sx={{ m: 1 }}
        error={Boolean(errors.Note)}
        helperText={errors.Note ? errors.Note.message : ''}
        {...register('Note', {
          required: 'Bitte geben Sie eine Note ein',
          min: { value: 0, message: 'Die Note muss mindestens 0 sein' },
          max: { value: 6, message: 'Die Note darf höchstens 6 sein' },
        })}
      />

      {/* Art des Leistungsnachweises */}
      <FormControl
        fullWidth
        margin="normal"
        error={Boolean(errors.Art)}
        sx={{ m: 1 }}
      >
        <InputLabel id="art-label">Art des Leistungsnachweises</InputLabel>
        <Select
          labelId="art-label"
          id="art-select"
          label="Art des Leistungsnachweises"
          defaultValue=""
          {...register('Art', { required: 'Bitte wählen Sie die Art aus' })}
        >
          {leistungsnachweise.map((leistungsnachweis) => (
            <MenuItem key={leistungsnachweis.id} value={leistungsnachweis.art}>
              {leistungsnachweis.art}
            </MenuItem>
          ))}
        </Select>
        {errors.Art && <FormHelperText>{errors.Art.message}</FormHelperText>}
      </FormControl>

      {/* Datum Auswahl mit react-datepicker */}
      <FormControl
        fullWidth
        margin="normal"
        error={Boolean(errors.Datum)}
        sx={{ m: 1 }}
      >
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
                  error={Boolean(errors.Datum)}
                  helperText={errors.Datum ? errors.Datum.message : ''}
                />
              }
            />
          )}
        />
      </FormControl>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ mt: 3, mb: 2, m: 1 }}
      >
        Note hinzufügen
      </Button>
    </Box>
  );
};

export default AddGradeForm;
