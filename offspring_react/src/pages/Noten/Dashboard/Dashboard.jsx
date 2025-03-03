// src/components/DeinPfad/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  fetchUserGrades,
  addUserGrade
} from "../../../api_services/noten/notenService";
import { useAuthContext } from "../../../context/AuthContext";
import { fetchAusbildungsDetails } from "../../../api_services/noten/ausbildungsfaecherService";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import GradeOverview from "./GradeOverview";
import GradeChart from "./GradeChart";
import GradeList from "./GradeList";
import AddGradeForm from "../AddGradeForm";
import GradeRadarChart from "./../../../components/Charts/GradeRadarChart"
import Loading from "../LoadingMessage";
import ErrorMessage from "../ErrorMessage";

const Dashboard = () => {
  const { user } = useAuthContext();
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [leistungsnachweise, setLeistungsnachweise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Noten laden
        const gradesResponse = await fetchUserGrades();
        setGrades(gradesResponse.data);

        // Ausbildungsdetails (Fächer, Leistungsnachweise)
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

  // Neue Note hinzufügen
  const handleAddGrade = async (newGrade) => {
    try {
      const response = await addUserGrade(newGrade);
      if (response && response.data) {
        // Lokal anfügen, ohne neu zu laden
        setGrades((prevGrades) => [...prevGrades, response.data]);
      }
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Note", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
   

      {/* Button-Navigation */}
      <ButtonGroup variant="contained" sx={{ mb: 3 }}>
        <Button
          onClick={() => setActiveView("overview")}
          disabled={activeView === "overview"}
        >
          Übersicht
        </Button>
        <Button
          onClick={() => setActiveView("chart")}
          disabled={activeView === "chart"}
        >
          Liniendiagramm
        </Button>
        <Button
          onClick={() => setActiveView("radar")}
          disabled={activeView === "radar"}
        >
          Radar
        </Button>
        <Button
          onClick={() => setActiveView("list")}
          disabled={activeView === "list"}
        >
          Notenliste
        </Button>
        <Button
          onClick={() => setActiveView("add")}
          disabled={activeView === "add"}
        >
          Note hinzufügen
        </Button>
      </ButtonGroup>

      {/* Inhalte je nach activeView */}
      {activeView === "overview" && <GradeOverview grades={grades} faecher={faecher} />}
      {activeView === "chart" && <GradeChart grades={grades} faecher={faecher} />}
      {activeView === "radar" && (
        <GradeRadarChart grades={grades} faecher={faecher} />
      )}
      {activeView === "list" && (
        <GradeList
          grades={grades}
          setGrades={setGrades} // <- sehr wichtig zum lokalen Aktualisieren
          faecher={faecher}
          leistungsnachweise={leistungsnachweise}
        />
      )}
      {activeView === "add" && (
        <AddGradeForm
          faecher={faecher}
          leistungsnachweise={leistungsnachweise}
          onAddGrade={handleAddGrade}
        />
      )}
    </Box>
  );
};

export default Dashboard;
