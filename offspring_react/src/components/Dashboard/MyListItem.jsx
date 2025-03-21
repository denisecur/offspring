import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";

const MyListItem = ({ selected, onClick, primaryText }) => {
  const theme = useTheme();

  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        // Überschreibe den selektierten Zustand:
        "&.Mui-selected": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        "&.Mui-focusVisible": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        // Hover-Zustand: hier kannst du auch theme.palette.primary.light nutzen,
        // falls du das in deinem Theme definierst oder mit lighten() erzeugst
        ":hover": {
          backgroundColor: theme.palette.primary.light,
        },
      }}
    >
      <ListItemText primary={primaryText} />
    </ListItemButton>
  );
};

export default MyListItem;
