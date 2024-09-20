import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addUserGrade } from "../../api/noten/notenService"; // Backend-Funktion importieren

export default function AddGradeForm({ faecher, leistungsnachweise, onAddGrade }) {
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const [selectedDate, setSelectedDate] = useState(null); // Verwende state für das Datum
  
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
  
      // Überprüfe, ob eine Antwort von der API kommt, bevor der Callback aufgerufen wird
      if (response && response.data) {
        console.log("Note erfolgreich hinzugefügt", response.data);
        if (onAddGrade) {
          onAddGrade(response.data);  // Übergebe nur die API-Antwort an die Elternkomponente
        }
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Note:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register("Fach", { required: true })}>
        {faecher.map((fach) => (
          <option key={fach.id} value={fach.id}>
            {fach.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Note"
        {...register("Note", { required: true, max: 6, min: 0, maxLength: 1 })}
      />

      <select {...register("Art", { required: true })}>
        {leistungsnachweise.map((leistungsnachweis) => (
          <option key={leistungsnachweis.id} value={leistungsnachweis.art}>
            {leistungsnachweis.art}
          </option>
        ))}
      </select>

      {/* DatePicker-Komponente zur Auswahl des Datums */}
      <Controller
        control={control}
        name="Datum"
        render={({ field }) => (
          <DatePicker
            placeholderText="Wähle ein Datum"
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);  // Speichert das ausgewählte Datum im state
              field.onChange(date);
            }}
            dateFormat="yyyy-MM-dd"
          />
        )}
      />

      <input type="submit" />
    </form>
  );
}
