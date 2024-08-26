import React from 'react';
import { ListItem, ListItemText, List } from '@mui/material';

const Fachliste = ({ faecher }) => {
  if (!Array.isArray(faecher)) {
    return <div>Faecher is not an array!</div>;
  }

  const listItems = faecher.map((fach) => (
    <ListItem disablePadding key={fach.id}>
      <ListItemText primary={fach.attributes.name} />
    </ListItem>
  ));

  return (
    <div>
      <List>
        {listItems}
      </List>
    </div>
  );
};

export default Fachliste;
