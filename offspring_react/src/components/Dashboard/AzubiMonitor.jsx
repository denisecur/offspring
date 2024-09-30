import {
    ToggleButtonGroup,
    ToggleButton,
    Box,
    Typography,
    Paper,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import GradeTableWithCharts from "../../pages/Noten/Dashboard/GradeTableWithCharts";
  import { fetchUserGrades } from "../../api/noten/notenService";
  import { fetchAusbildungsDetails } from "../../api/noten/ausbildungsfaecherService";
  
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
  
    // Funktion zur Berechnung des Schuljahres
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
      return <div>Bitte wähle einen Azubi aus der Liste aus.</div>;
    }
  
    // Funktion, um den Tab-Inhalt zu rendern
    const renderTabContent = () => {
      switch (singleModeTabs) {
        case "leistungsstand":
          return (
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Leistungsstand</Typography>
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
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Competitive Mode</Typography>
              <Typography variant="body1">
                Dieser Bereich zeigt die Wettbewerbsfähigkeitsdaten des Azubis an.
              </Typography>
            </Paper>
          );
        case "berichtshefte":
          return (
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Berichtshefte</Typography>
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
      <div className="azubi-monitor">
        <h2>{`${azubi.username}`}</h2>
        {/* Azubi-Informationen */}
        <p>Fachrichtung: {azubi.fachrichtung}</p>
  
        <ToggleButtonGroup
          value={singleModeTabs}
          exclusive
          onChange={handleSingleModeTabs}
          aria-label="singleModeAnsichts-Wahl"
          sx={{ ml: "auto" }}
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
        <Box sx={{ mt: 2 }}>{renderTabContent()}</Box>
      </div>
    );
  };
  
  export default AzubiMonitor;
  