import React from 'react';
import { Button } from '@mui/material';
import AddNoteForm from './AddNoteForm';

const onClickedAdd = () => {
  // Add your logic here
  console.log("Circle icon clicked");
};

const AddNote = () => {
  return (
    <div>
        <h1>Note hinzufügen</h1>
        <AddNoteForm/>
      <Button variant="outlined" onClick={onClickedAdd}>+</Button>
    </div>
  );
}

export default AddNote;
