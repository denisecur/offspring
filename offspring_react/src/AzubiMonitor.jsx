import React, { useEffect, useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import GradeTableWithCharts from "./pages/Noten/Dashboard/GradeTableWithCharts";
import { fetchUserGrades } from "./api_services/noten/notenService";
import { fetchAusbildungsDetails } from "./api_services/noten/ausbildungsfaecherService";
import AzubiDetails from "./components/Dashboard/AzubiDetails";
import AzubiStatsOverview from "./components/Dashboard/AzubiStatsOverview";
import {Grid} from "@mui/material";
import LineGraph from "./components/Dashboard/LineGraph";
import Rahmen1 from "./components/Rahmen1";
import CompetitiveComparison from "./pages/Noten/Dashboard/CompetitiveComparison";

const AzubiMonitor = ({ azubi }) => {
  const [singleModeTabs, setSingleModeTabs] = useState("leistungsstand");
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [leistungsnachweise, setLeistungsnachweise] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [filter, setFilter] = useState({ jahr: "", fach: "", art: "" });
  const [schoolYears, setSchoolYears] = useState([]);

  // Hilfsfunktion zur Berechnung des Schuljahres
  const getSchoolYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  // Noten aller Azubis laden
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGrades(); // Lädt alle Noten
        const gradesData = response.data;

        // Berechne die Schuljahre für alle Noten
        const years = [
          ...new Set(gradesData.map((grade) => getSchoolYear(grade.datum))),
        ];
        setSchoolYears(years);
        setGrades(gradesData);
      } catch (err) {
        setError("Fehler beim Abrufen der Noten");
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  // Filtere Noten nach ausgewähltem Azubi
  useEffect(() => {
    if (!azubi || grades.length === 0) {
      setFilteredGrades([]);
      return;
    }
    // Filtere die Noten basierend auf owner.id
    const azubiGrades = grades.filter(
      (grade) => grade.owner && grade.owner.id === azubi.id
    );

    // Anwenden weiterer Filter (Jahr, Fach, Art)
    let filtered = azubiGrades;

    // Filter nach Jahr
    if (filter.jahr) {
      filtered = filtered.filter(
        (grade) => getSchoolYear(grade.datum) === filter.jahr
      );
    }
    // Filter nach Fach
    if (filter.fach) {
      filtered = filtered.filter(
        (grade) =>
          grade.ausbildungsfach &&
          grade.ausbildungsfach.id === parseInt(filter.fach)
      );
    }
    // Filter nach Art des Leistungsnachweises
    if (filter.art) {
      filtered = filtered.filter((grade) => grade.art === filter.art);
    }

    setFilteredGrades(filtered);
  }, [azubi, grades, filter]);

  // Ausbildungsdetails (Fächer, Leistungsnachweise) laden
  useEffect(() => {
    const loadAusbildungsDetails = async () => {
      if (!azubi?.fachrichtung) return; // Warte, bis die Fachrichtung verfügbar ist
      try {
        const ausbildungsDetails = await fetchAusbildungsDetails(
          azubi.fachrichtung
        );
        setFaecher(ausbildungsDetails.faecher);
        setLeistungsnachweise(ausbildungsDetails.leistungsnachweise);
      } catch (err) {
        setError("Fehler beim Abrufen der Ausbildungsdetails");
      }
    };
    loadAusbildungsDetails();
  }, [azubi]);

  const handleSingleModeTabs = (event, newView) => {
    if (newView !== null) {
      setSingleModeTabs(newView);
    }
  };

  if (!azubi) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Bitte wähle einen Azubi aus der Liste aus.</Typography>
      </Box>
    );
  }

  const renderTabContent = () => {
    switch (singleModeTabs) {
      case "leistungsstand":
        return (
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography gutterBottom sx={{ fontSize: "16px" }}>
              Leistungsstand
            </Typography>
            {loading ? (
              <Typography>Lädt...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <GradeTableWithCharts grades={filteredGrades} />
            )}
          </Paper>
        );
      case "competitive":
        return (
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <CompetitiveComparison allGrades={grades} faecher={faecher} />
          </Paper>
        );
      case "berichtshefte":
        return (
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Berichtshefte
            </Typography>
            <Typography variant="body1">
              Hier können die Berichtshefte des Azubis eingesehen werden.
            </Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      
      <Grid item md={4}>
        <AzubiDetails
          username={azubi.username}
          fachrichtung={azubi.fachrichtung}
          grades={filteredGrades}
          faecher={faecher}
        />
        <LineGraph grades={filteredGrades} />
      </Grid>
      <Grid item md={8}>
        <AzubiStatsOverview
          selectedAzubi={azubi}
          grades={filteredGrades}
          faecher={faecher}
        />
      </Grid>
  
      <ToggleButtonGroup
        value={singleModeTabs}
        exclusive
        onChange={handleSingleModeTabs}
        aria-label="singleModeAnsichts-Wahl"
      >
        <ToggleButton value="leistungsstand" aria-label="Leistungsstand">
          Leistungsstand
        </ToggleButton>
        <ToggleButton value="competitive" aria-label="competitive">
          Competitive
        </ToggleButton>
        <ToggleButton value="berichtshefte" aria-label="berichtshefte">
          Berichtshefte
        </ToggleButton>
      </ToggleButtonGroup>
  
      {/* Dynamischer Inhalt basierend auf ausgewähltem Tab */}
      {renderTabContent()}
    </Grid>
  );
}
export default AzubiMonitor;
