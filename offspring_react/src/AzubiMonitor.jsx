// src/AzubiMonitor.jsx
import React, { useEffect, useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import NotenStand from "./pages/Noten/Dashboard/NotenStand";
import Berichtshefte from "./pages/Berichtshefte/Berichtshefte";
import { fetchUserGrades } from "./api_services/noten/notenService";
import { fetchAusbildungsDetails } from "./api_services/noten/ausbildungsfaecherService";

const AzubiMonitor = ({ azubi }) => {
  const [selectedTab, setSelectedTab] = useState("noten"); // "noten" oder "berichtshefte"
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Noten laden (für Leistungsstand)
  useEffect(() => {
    if (!azubi) return;
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGrades();
        setGrades(response.data);
      } catch (err) {
        setError("Fehler beim Abrufen der Noten");
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, [azubi]);

  // Ausbildungsdetails laden (für Noten)
  useEffect(() => {
    if (!azubi?.fachrichtung) return;
    const loadDetails = async () => {
      try {
        const details = await fetchAusbildungsDetails(azubi.fachrichtung);
        setFaecher(details.faecher);
      } catch (err) {
        setError("Fehler beim Abrufen der Ausbildungsdetails");
      }
    };
    loadDetails();
  }, [azubi]);

  if (!azubi) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Bitte wähle einen Azubi aus der Liste aus.</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <ToggleButtonGroup
        value={selectedTab}
        exclusive
        onChange={(event, newValue) => {
          if (newValue !== null) setSelectedTab(newValue);
        }}
        aria-label="Ansichtsauswahl"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="noten" aria-label="Leistungsstand">
          Leistungsstand
        </ToggleButton>
        <ToggleButton value="berichtshefte" aria-label="Berichtshefte">
          Berichtshefte
        </ToggleButton>
      </ToggleButtonGroup>
      {loading && <Typography>Lade Daten...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {selectedTab === "noten" ? (
        <Paper elevation={3} sx={{ p: 2 }}>
          <NotenStand key={azubi.id} azubi={azubi} grades={grades} faecher={faecher} />
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
<Berichtshefte key={azubi.id} azubi={azubi} allowUpload={false} />
</Paper>
      )}
    </Container>
  );
};

export default AzubiMonitor;
