import React, { useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Button,
} from "@mui/material";

export default function AzubiListe({
  azubis,
  onSelectAzubi,
  selectedAzubi,
  selectedTab,
  setSelectedTab,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fachrichtungFilter, setFachrichtungFilter] = useState([]);

  const fachrichtungen = ["Büromanagement", "Versicherungen und Finanzanlagen"];

  const handleFachrichtungToggle = (fachrichtung) => {
    setFachrichtungFilter((prev) =>
      prev.includes(fachrichtung)
        ? prev.filter((f) => f !== fachrichtung)
        : [...prev, fachrichtung]
    );
  };

  // Azubi-Liste filtern
  const filteredAzubis = azubis.filter((azubi) => {
    const nameLower = (azubi.username || "").toLowerCase();
    const matchesSearch = nameLower.includes(searchTerm.toLowerCase());
    const matchesFachrichtung =
      fachrichtungFilter.length === 0 ||
      fachrichtungFilter.includes(azubi.fachrichtung);
    return matchesSearch && matchesFachrichtung;
  });

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        overflowY: "auto",
        bgcolor: "white", // Weißer Hintergrund
      }}
      elevation={3}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Azubi-Liste
      </Typography>

      {/* Toggle für Leistungsstand / Berichtshefte */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <Button
          onClick={() => setSelectedTab("noten")}
          variant={selectedTab === "noten" ? "contained" : "outlined"}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Leistungsstand
        </Button>
        <Button
          onClick={() => setSelectedTab("berichtshefte")}
          variant={selectedTab === "berichtshefte" ? "contained" : "outlined"}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Berichtshefte
        </Button>
      </Box>

      {/* Suchfeld */}
      <TextField
        label="Suche..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Fachrichtungs-Checkboxen */}
      <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
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

      {/* Gefilterte Azubi-Liste */}
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {filteredAzubis.map((azubi) => {
          const isSelected = selectedAzubi && selectedAzubi.id === azubi.id;
          return (
            <Box
              key={azubi.id}
              onClick={() => onSelectAzubi(azubi)}
              sx={{
                mb: 1,
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 3,
                },
                // Grüner Hintergrund, wenn ausgewählt
                ...(isSelected && {
                  bgcolor: "green.50",
                  borderLeft: "6px solid",
                  borderColor: "green.300",
                }),
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {azubi.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {azubi.fachrichtung}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
