import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import NotenStand from "./pages/Noten/Dashboard/Leistungsstand";
import Berichtshefte from "./pages/Berichtshefte/Berichtshefte";
import { fetchUserGrades } from "./api_services/noten/notenService";
import { fetchAusbildungsDetails } from "./api_services/noten/ausbildungsfaecherService";

export default function AzubiMonitor({ azubi, selectedTab }) {
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Noten laden
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

  // Ausbildungsdetails laden
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

  // Fall: Kein Azubi ausgewählt
  if (!azubi) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Kein Azubi ausgewählt
          </Typography>
          <Typography variant="body1">
            Bitte wähle einen Azubi aus der Liste aus, um fortzufahren.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        gap: 2, bgcolor:"white" 
      }}
    >
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", bgcolor:"white"  }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {selectedTab === "noten" ? (
        <NotenStand azubi={azubi} grades={grades} faecher={faecher} />
      ) : (
        <Berichtshefte azubi={azubi} allowUpload={false} />
      )}
    </Paper>
  );
}
