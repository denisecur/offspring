// src/components/Dashboard/ChefDashboard.jsx
import React, { useEffect, useState } from "react";
import { SplitScreen } from "../Layout/SplitScreen";
import AzubiListe from "../AzubiListe";
import AzubiMonitor from "../../AzubiMonitor";
import { fetchAzubis } from "../../api_services/azubis/azubiService";
import { fetchUserGrades } from "../../api_services/noten/notenService";
import { fetchAusbildungsDetails } from "../../api_services/noten/ausbildungsfaecherService";
import CompetitiveComparison from "../../pages/Noten/Dashboard/CompetitiveComparison";
import CompetitiveComparisonBarChart from "../../pages/Noten/Dashboard/CompetitiveComparisonBarChart";
import CompetitiveOverview from "../../pages/Noten/Dashboard/CompetitiveOverview";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Paper,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const ChefDashboard = () => {
  const [azubis, setAzubis] = useState([]);
  const [modeTab, setModeTab] = useState("single"); // "single" oder "multi"
  const [selectedAzubi, setSelectedAzubi] = useState(null);

  // Für den Multi‑Tab: Noten, Fächer, Fehler, Ladezustand usw.
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [competitiveTab, setCompetitiveTab] = useState("comparison");

  
  // Hilfsfunktion: Schuljahr anhand eines Datums berechnen
  const getSchoolYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  // Azubis laden (unabhängig vom Modus)
  useEffect(() => {
    const loadAzubis = async () => {
      try {
        const response = await fetchAzubis();
        setAzubis(response);
      } catch (error) {
        console.error("Fehler beim Laden der Azubis:", error);
      }
    };
    loadAzubis();
  }, []);

  // Im Multi‑Tab: Noten laden
  useEffect(() => {
    if (modeTab !== "multi") return;
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGrades();
        const gradesData = response.data;
        const years = [...new Set(gradesData.map((grade) => getSchoolYear(grade.datum)))];
        setSchoolYears(years);
        setGrades(gradesData);
      } catch (err) {
        setError("Fehler beim Abrufen der Noten");
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, [modeTab]);

  // Im Multi‑Tab: Ausbildungsdetails laden – verwende z. B. den ersten Azubi als Standard
  useEffect(() => {
    if (modeTab !== "multi" || azubis.length === 0) return;
    const loadAusbildungsDetails = async () => {
      const defaultAzubi = azubis[0];
      if (!defaultAzubi?.fachrichtung) return;
      try {
        const ausbildungsDetails = await fetchAusbildungsDetails(defaultAzubi.fachrichtung);
        setFaecher(ausbildungsDetails.faecher);
        // Hier könnten weitere Daten wie Leistungsnachweise gesetzt werden
      } catch (err) {
        setError("Fehler beim Abrufen der Ausbildungsdetails");
      }
    };
    loadAusbildungsDetails();
  }, [modeTab, azubis]);

  const handleModeTabs = (event, newView) => {
    if (newView !== null) {
      setModeTab(newView);
      // Optional: Setze den inneren Tab beim Wechsel zurück:
      if (newView === "multi") {
        setCompetitiveTab("comparison");
      }
    }
  };
  const renderModeTabsContent = () => {
    switch (modeTab) {
      case "single":
        return (
          <SplitScreen leftWeight={1} rightWeight={3}>
            <AzubiListe azubis={azubis} onSelectAzubi={setSelectedAzubi} />
            <AzubiMonitor azubi={selectedAzubi} />
          </SplitScreen>
        );
      case "multi":
        return (
          <SplitScreen leftWeight={1} rightWeight={4}>
            <Paper sx={{ p: 2, mr: 2 }}>
              <Typography variant="h6">Statistik-Liste</Typography>
              <Typography variant="body1">
                Hier könnte z. B. eine Übersichtstabelle aller Azubis stehen.
              </Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Wettbewerb</Typography>
              <Typography variant="body1">
                Hier könnten die zugehörigen Diagramme eingefügt werden.
              </Typography>
              {/* Innere Tabs für Wettbewerb */}
              <ToggleButtonGroup
                value={competitiveTab}
                exclusive
                onChange={(e, newValue) => {
                  if (newValue !== null) setCompetitiveTab(newValue);
                }}
                sx={{ mt: 2, mb: 2 }}
              >
                <ToggleButton value="comparison">Vergleich</ToggleButton>
                <ToggleButton value="bar">Balkendiagramm</ToggleButton>
                <ToggleButton value="overview">Übersicht</ToggleButton>
              </ToggleButtonGroup>
              {/* Conditionally render competitive components */}
              {competitiveTab === "comparison" && (
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                  <CompetitiveComparison allGrades={grades} faecher={faecher} />
                </Paper>
              )}
              {competitiveTab === "bar" && (
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                  <CompetitiveComparisonBarChart allGrades={grades} faecher={faecher} />
                </Paper>
              )}
              {competitiveTab === "overview" && (
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                  <CompetitiveOverview allGrades={grades} faecher={faecher} />
                </Paper>
              )}
            </Paper>
          </SplitScreen>
        );
      default:
        return <Typography>Es ist kein Tab ausgewählt.</Typography>;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <ToggleButtonGroup
            value={modeTab}
            exclusive
            onChange={handleModeTabs}
            aria-label="modeTab-Ansichtsauswahl"
            size="small"
            sx={{ backgroundColor: "pink", borderRadius: 2 }}
          >
            <ToggleButton value="single" aria-label="Einzelansicht">
              <FormatListBulletedIcon sx={{ mr: 1 }} />
              Azubis
            </ToggleButton>
            <ToggleButton value="multi" aria-label="Multiansicht">
              <QueryStatsIcon sx={{ mr: 1 }} />
              Wettbewerb
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Überblick
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>{renderModeTabsContent()}</Box>
        </Paper>
      </Container>
    </>
  );
};

export default ChefDashboard;