import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";

const AzubiListe = ({ azubis, onSelectAzubi }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fachrichtungFilter, setFachrichtungFilter] = useState([]);

  // Beispielhafte Fachrichtungen
  const fachrichtungen = [
    "Büromanagement",
    "Versicherungen und Finanzanlagen",
  ]; // TODO: Evtl. über API laden

  // Handler für Fachrichtungsfilter
  const handleFachrichtungToggle = (fachrichtung) => {
    setFachrichtungFilter((prev) =>
      prev.includes(fachrichtung)
        ? prev.filter((f) => f !== fachrichtung)
        : [...prev, fachrichtung]
    );
  };

  // Filtere Azubis
  const filteredAzubis = azubis.filter((azubi) => {
    const nameLower = (azubi.username || "").toLowerCase();
    const matchesSearch = nameLower.includes(searchTerm.toLowerCase());
    const matchesFachrichtung =
      fachrichtungFilter.length === 0 ||
      fachrichtungFilter.includes(azubi.fachrichtung);

    return matchesSearch && matchesFachrichtung;
  });

  return (
    <div>

     

      {/* Suchleiste */}
      <TextField
        label="Suche nach Name..."
        variant="outlined"
        size="small"
      
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Fachrichtungsfilter */}
      <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
        <Typography variant="subtitle1">Fachrichtung filtern:</Typography>
        {fachrichtungen.map((fachrichtung) => (
          <FormControlLabel
            key={fachrichtung}
            control={
              <Checkbox
                checked={fachrichtungFilter.includes(fachrichtung)}
                onChange={() => handleFachrichtungToggle(fachrichtung)}
              />
            }
            label={fachrichtung}
          />
        ))}
      </Box>

      {/* Azubi-Liste */}
      <List>
        {filteredAzubis.map((azubi) => (
          <ListItem
            key={azubi.id}
            disablePadding
            onClick={() => onSelectAzubi(azubi)}
          >
            <ListItemButton>
              <ListItemText primary={azubi.username} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AzubiListe;
