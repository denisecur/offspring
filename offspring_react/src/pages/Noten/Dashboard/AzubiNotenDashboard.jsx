// src/components/DeinPfad/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
} from "@mui/material";

import { fetchUserGrades, addUserGrade } from "../../../api_services/noten/notenService";
import { useAuthContext } from "../../../context/AuthContext";
import { fetchAusbildungsDetails } from "../../../api_services/noten/ausbildungsfaecherService";

// Eigene Komponenten
import NotenStand from "./NotenStand";
import NotenVerwaltung from "./NotenVerwaltung";
import Loading from "../LoadingMessage";
import ErrorMessage from "../ErrorMessage";

/**
 * Dashboard: Lädt Noten & Fächer aus dem Backend und
 * stellt unterschiedliche Views zur Verfügung
 */
const Dashboard = () => {
  const { user } = useAuthContext();
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [leistungsnachweise, setLeistungsnachweise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("notenstand");

  // Zentraler Schuljahr-Filter auf Dashboard-Ebene
  const [selectedYear, setSelectedYear] = useState("");

  // Hilfsfunktion: Schuljahr bestimmen (z. B. "2023/2024")
  const getSchoolYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  // Daten laden
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1) Noten laden
        const gradesResponse = await fetchUserGrades();
        setGrades(gradesResponse.data);

        // 2) Ausbildungsdetails (Fächer, Leistungsnachweise)
        const { faecher, leistungsnachweise } = await fetchAusbildungsDetails(
          user?.ausbildung?.name
        );
        setFaecher(faecher);
        setLeistungsnachweise(leistungsnachweise);
      } catch (err) {
        setError("Fehler beim Abrufen der Daten");
      } finally {
        setLoading(false);
      }
    }; 
    loadData();
  }, [user]);

  // Dynamisch verfügbare Schuljahre aus den Noten extrahieren
  const allYears = [
    ...new Set(grades.map((g) => getSchoolYear(g.datum))),
  ].sort();

  // Neue Note hinzufügen (wird in "AddGradeForm" genutzt)
  const handleAddGrade = async (newGrade) => {
    try {
      const response = await addUserGrade(newGrade);
      if (response && response.data) {
        // Lokal anfügen, ohne erneut zu laden
        setGrades((prevGrades) => [...prevGrades, response.data]);
      }
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Note", err);
    }
  };

  // Loading / Error
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box sx={{ p: 2 }}>
      {/* Button-Navigation */}
      <ButtonGroup variant="contained" sx={{ ml: 2,
         mb: 3 }}>
        <Button
          onClick={() => setActiveView("notenstand")}
          disabled={activeView === "notenstand"}
        >
          Notenstand
        </Button>
        <Button
          onClick={() => setActiveView("notenverwaltung")}
          disabled={activeView === "notenverwaltung"}
        >
          NotenVerwaltung
        </Button>
      </ButtonGroup>

      {/* View-Wechsel */}
      {activeView === "notenstand" && (
        <NotenStand
          grades={grades}
          faecher={faecher}
          selectedYear={selectedYear}
        />
      )}
      {activeView === "notenverwaltung" && (
        <NotenVerwaltung
          grades={grades}
          setGrades={setGrades}
          faecher={faecher}
          leistungsnachweise={leistungsnachweise}
          onAddGrade={handleAddGrade} // Übergabe der Funktion zum Hinzufügen
        />
      )}
    </Box>
  );
};

export default Dashboard;
