import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import CompetitiveComparison from "../../pages/Noten/Dashboard/CompetitiveComparison";
import CompetitiveComparisonBarChart from "../../pages/Noten/Dashboard/CompetitiveComparisonBarChart";
import CompetitiveOverview from "../../pages/Noten/Dashboard/CompetitiveOverview";
import { fetchUserGrades } from "../../api_services/noten/notenService";
import { fetchAusbildungsDetails } from "../../api_services/noten/ausbildungsfaecherService";
import Leaderboard from "./Leaderboard";

export default function Ranking() {
  const [currentTab, setCurrentTab] = useState("leaderboard");
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Daten laden: Noten und Ausbildungsdetails
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const gradesResponse = await fetchUserGrades();
        setGrades(gradesResponse.data);

        const ausbildungsDetails = await fetchAusbildungsDetails();
        setFaecher(ausbildungsDetails.faecher);
      } catch (err) {
        console.error("Fehler beim Laden der Daten:", err);
        setError(err.message || "Fehler beim Abrufen der Daten");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Titel und ToggleButtons */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          Ranking
        </Typography>

        <ToggleButtonGroup
          value={currentTab}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) setCurrentTab(newValue);
          }}
          size="small"
        >
          <ToggleButton value="leaderboard">Leaderboard</ToggleButton>
          <ToggleButton value="comparison">Radar Chart</ToggleButton>
          <ToggleButton value="overview">Übersicht</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Ladezustand */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Fehlermeldung */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Inhalt, falls nicht loading/error */}
      {!loading && !error && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {currentTab === "leaderboard" && (
              <Leaderboard allGrades={grades} faecher={faecher} />
            )}

            {currentTab === "comparison" && (
              <CompetitiveComparison allGrades={grades} faecher={faecher} />
            )}

            {currentTab === "overview" && (
              <CompetitiveOverview allGrades={grades} faecher={faecher} />
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
