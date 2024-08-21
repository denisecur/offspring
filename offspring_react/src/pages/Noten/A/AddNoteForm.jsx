import React, { useState } from 'react';
import DatePicker from "react-datepicker";

const AddNoteForm = () => {
  const [startDate, setStartDate] = useState(new Date()); //DatePicker
  const [formData, setFormData] = useState({
    note: '',
    datum: '',
    fach: '',
    art: '',
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, we'll add the code to post the form data using Axios
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="Note"
        placeholder="0"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="date"
        name="Datum"
        placeholder="..."
        value={formData.datum}
        onChange={handleChange}
      />


       <select className="select select-primary w-full max-w-xs">
          <option disabled selected>
           Art
          </option>
          <option>Schulaufgabe</option>
          <option>Kurzarbeit</option>
          <option>Stegreifaufgabe</option>
          <option>Mündliche Leistung</option>
        </select>

    <button type="submit" className="btn btn-accent">Accent</button>    
    
    </form>

  );
};

export default AddNoteForm;