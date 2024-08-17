import React, { useState } from 'react';

const AddNoteForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
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
      <textarea
        type="text"
        name="Fach"
        placeholder="Geschichte"
        value={formData.fach}
        onChange={handleChange}
      />
      <button type="submit">Speichern</button>
    </form>
  );
};

export default AddNoteForm;