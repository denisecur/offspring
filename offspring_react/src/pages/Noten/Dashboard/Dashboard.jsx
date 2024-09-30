import React, { useState, useEffect } from "react";
import { fetchUserGrades, addUserGrade } from "../../../api/noten/notenService";
import { useAuthContext } from "../../../context/AuthContext";
import GradeTable from "../GradeTable";
import FachDurchschnittChart from "./FachDurchschnittChart";
import AddGradeForm from "../AddGradeForm";
import Loading from "../LoadingMessage";
import ErrorMessage from "../ErrorMessage";
import { fetchAusbildungsDetails } from "../../../api/noten/ausbildungsfaecherService";
import Box from "@mui/material/Box";
import DurchschnittListe from "./DurchschnittListe";
import MyHeading from "../../../components/MyHeading";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FilterComponent from "../FilterComponent";
import GradeTableWithCharts from "./GradeTableWithCharts";
import NotenDashboard from "./NotenDashboard";

const Dashboard = () => {
  const { user } = useAuthContext();
  const [grades, setGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [leistungsnachweise, setLeistungsnachweise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ausbildungsrichtung = user?.ausbildung?.name;
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [filter, setFilter] = useState({ jahr: "", fach: "", art: "" });
  const [schoolYears, setSchoolYears] = useState([]);

  // **State für die aktuelle Ansicht**
  const [activeView, setActiveView] = useState("uebersicht");

  // Funktion zur Berechnung des Schuljahres
  const getSchoolYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  // Noten laden
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGrades();
        const gradesData = response.data;

        // Berechne die Schuljahre für alle Noten
        const years = [
          ...new Set(gradesData.map((grade) => getSchoolYear(grade.datum))),
        ];
        setSchoolYears(years);
        setGrades(gradesData);
        setFilteredGrades(gradesData); // Initialisiere gefilterte Noten
      } catch (err) {
        setError("Fehler beim Abrufen der Noten");
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  // Fächer und Leistungsnachweise laden
  useEffect(() => {
    const loadAusbildungsDetails = async () => {
      try {
        const { faecher, leistungsnachweise } = await fetchAusbildungsDetails(
          ausbildungsrichtung
        );
        setFaecher(faecher);
        setLeistungsnachweise(leistungsnachweise);
      } catch (err) {
        setError("Fehler beim Abrufen der Ausbildungsdetails");
      }
    };
    if (ausbildungsrichtung) {
      loadAusbildungsDetails();
    }
  }, [ausbildungsrichtung]);

  // Filterung der Noten
  useEffect(() => {
    let filtered = grades;

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
  }, [filter, grades]);

  const handleAddGrade = async (newGrade) => {
    try {
      const response = await addUserGrade(newGrade);
      if (response && response.data) {
        setGrades((prevGrades) => [...prevGrades, response.data]);
        // Nach dem Hinzufügen einer neuen Note die Filter aktualisieren
        setFilter({ jahr: "", fach: "", art: "" });
      }
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Note", err);
    }
  };

  // Durchschnitt berechnen
  const calculateAverage = (grades) => {
    if (grades.length === 0) return "N/A";
    const sum = grades.reduce(
      (total, grade) => total + parseFloat(grade.wert) * grade.gewichtung,
      0
    );
    const totalWeight = grades.reduce(
      (total, grade) => total + parseFloat(grade.gewichtung),
      0
    );
    return (sum / totalWeight).toFixed(2);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  // Hilfsfunktion innerhalb der Komponente definieren
  const getButtonStyles = (view) => ({
    backgroundColor:
      activeView === view ? "ochre.switchButton" : "ochre.ausgegraut",
    color: "ochre.contrastText",
    "&:hover": {
      backgroundColor: activeView === view ? "ochre.dark" : "ochre.light",
    },
  });

  return (
    <div>
      <NotenDashboard grades={grades}/>
      <hr></hr>
      <hr></hr>
 
      {/* Buttons zum Wechseln der Ansicht */}
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <ButtonGroup variant="contained">
          {/* Erster Button */}
          <Button
            variant="contained"
            onClick={() => setActiveView("uebersicht")}
            sx={getButtonStyles("uebersicht")}
          >
            Übersicht
          </Button>
          {/* Zweiter Button */}
          <Button
            variant="contained"
            onClick={() => setActiveView("chart")}
            sx={getButtonStyles("chart")}
          >
            Chart
          </Button>
          {/* Dritter Button */}
          <Button
            variant="contained"
            onClick={() => setActiveView("liste")}
            sx={getButtonStyles("liste")}
          >
            Notenliste
          </Button>
          {/* Vierter Button */}
          <Button
            variant="contained"
            onClick={() => setActiveView("neueNote")}
            sx={getButtonStyles("neueNote")}
          >
            Note hinzufügen
          </Button>
        </ButtonGroup>
      </Box>

      {/* Bedingtes Rendering der Ansichten */}
      {activeView === "uebersicht" && (
        <div>
          {/* Gesamter Notendurchschnitt */}
          <div className="text-lg font-semibold text-gray-700">
          Gesamter Notendurchschnitt:{" "}
          <span className="text-blue-600">{calculateAverage(grades)}</span>
            <DurchschnittListe grades={grades} />
            
          </div>
        </div>
      )}

      {activeView === "chart" && (
        <div>
          {/* FachDurchschnittChart anzeigen */}
          <GradeTableWithCharts grades={grades} />
        </div>
      )}

      {activeView === "liste" && (
        <div>
          <FilterComponent
            faecher={faecher}
            leistungsnachweise={leistungsnachweise}
            schoolYears={schoolYears}
            filter={filter}
            setFilter={setFilter}
          />
<GradeTable grades={filteredGrades} filter={filter} faecher={faecher} />

</div>
      )}

      {activeView === "neueNote" && (
        <div>
          <AddGradeForm
            faecher={faecher}
            leistungsnachweise={leistungsnachweise}
            onAddGrade={handleAddGrade}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
