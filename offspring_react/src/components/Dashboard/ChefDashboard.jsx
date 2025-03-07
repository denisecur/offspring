import React, { useEffect, useState } from "react";
import { SplitScreen } from "../Layout/SplitScreen";
import AzubiListe from "../AzubiListe";
import AzubiMonitor from "../../AzubiMonitor";
import { fetchAzubis } from "../../api_services/azubis/azubiService";

import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const ChefDashboard = () => {
  const [azubis, setAzubis] = useState([]);
  const [modeTab, setModeTab] = useState("single"); // Einzelansicht oder Multi-Ansicht
  const [selectedAzubi, setSelectedAzubi] = useState(null);

  const handleModeTabs = (event, newView) => {
    if (newView !== null) {
      setModeTab(newView);
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
          <SplitScreen leftWeight={1} rightWeight={3}>
            <Paper sx={{ p: 2, mr: 2 }}>
              <Typography variant="h6">Statistik-Liste</Typography>
              <Typography variant="body1">
                Hier könnte z.B. eine Übersichtstabelle aller Azubis stehen.
              </Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Charts</Typography>
              <Typography variant="body1">
                Hier könnten die zugehörigen Diagramme eingefügt werden.
              </Typography>
            </Paper>
          </SplitScreen>
        );
      default:
        return <Typography>Es ist kein Tab ausgewählt.</Typography>;
    }
  };

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

  return (
    <>
      {/* AppBar / Toolbar – top navigation with a "command center" feel */}
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <DashboardIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chef-Dashboard – Kommandozentrale
          </Typography>
          {/* Mode Toggle Buttons in the AppBar for quick switching */}
          <ToggleButtonGroup
            value={modeTab}
            exclusive
            onChange={handleModeTabs}
            aria-label="modeTab-Ansichtsauswahl"
            size="small"
            sx={{ backgroundColor: "white", borderRadius: 2 }}
          >
            <ToggleButton value="single" aria-label="Einzelansicht">
              <FormatListBulletedIcon sx={{ mr: 1 }} />
              Einzel
            </ToggleButton>
            <ToggleButton value="multi" aria-label="Multiansicht">
              <QueryStatsIcon sx={{ mr: 1 }} />
              Multi
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
       
        {/* Main content: either single or multi view */}
        <Paper sx={{ p: 2 }}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Überblick
            </Typography>
          </Box>

          {/* Dynamischer Inhalt basierend auf ausgewähltem Tab */}
          <Box sx={{ mt: 2 }}>{renderModeTabsContent()}</Box>
        </Paper>
      </Container>
    </>
  );
};

export default ChefDashboard;
