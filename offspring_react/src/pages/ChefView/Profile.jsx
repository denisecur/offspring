import React, { useState, useEffect } from "react";
import { Container, Grid } from "@mui/material";
import AzubiListe from "../../components/AzubiListe";
import AzubiMonitor from "../../AzubiMonitor";
import { fetchAzubis } from "../../api_services/azubis/azubiService";

export default function Profile() {
  const [azubis, setAzubis] = useState([]);
  const [selectedAzubi, setSelectedAzubi] = useState(null);
  // Steuert, ob „noten“ oder „berichtshefte“ gezeigt wird
  const [selectedTab, setSelectedTab] = useState("noten");

  // Azubi-Daten laden
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
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {/* Linke Spalte: Azubi-Liste */}
        <Grid item xs={12} md={4}>
          <AzubiListe
            azubis={azubis}
            onSelectAzubi={setSelectedAzubi}
            selectedAzubi={selectedAzubi}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </Grid>

        {/* Rechte Spalte: Monitor (Noten/Berichtshefte) */}
        <Grid item xs={12} md={8}>
          <AzubiMonitor azubi={selectedAzubi} selectedTab={selectedTab} />
        </Grid>
      </Grid>
    </Container>
  );
}
