// ChefDashboard.jsx
import React, { useEffect, useState } from "react";
import { SplitScreen } from "../Layout/SplitScreen";
import AzubiListe from "../AzubiListe";
import AzubiMonitor from "./AzubiMonitor";
import { fetchAzubis } from "../../api_services/azubis/azubiService";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Paper,
} from "@mui/material";

const ChefDashboard = () => {
  const [azubis, setAzubis] = useState([]);
  const [modeTab, setModeTab] = useState("single"); // Einzelansicht: single oder Alle-Azubis: multi
  const [selectedAzubi, setSelectedAzubi] = useState(null); // innerhalb Einzelansicht

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
            <Typography variant="body1">
              Hier wird die Statsliste sein.
            </Typography>
            <Typography variant="body1">
              Hier werden dann die zugehörigen Charts angezeigt.
            </Typography>
          </SplitScreen>
        );
      default:
        return <p>Es ist kein Tab ausgewählt.</p>;
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
    <div>
      <ToggleButtonGroup
        value={modeTab}
        exclusive
        onChange={handleModeTabs}
        aria-label="modeTab-Ansichtsauswahl"
        sx={{ ml: "auto" }}
      >
        <ToggleButton value="single" aria-label="single">
          Single
        </ToggleButton>

        <ToggleButton value="multi" aria-label="multi">
          Multi
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Dynamischer Inhalt basierend auf ausgewähltem Tab */}
      <Box sx={{ mt: 2 }}>{renderModeTabsContent()}</Box>
    </div>
  );
};

export default ChefDashboard;
