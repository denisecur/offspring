import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material"; // Optional: To show a loading indicator
import Fachliste from "./Fachliste";
import { fetchAusbildungsfaecher } from "../../api/noten/ausbildungsfaecherService";
import { fetchUserGrades } from "../../api/noten/notenService";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";

const NotenPage = () => {
  const [faecher, setFaecher] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    datum: "",
    wert: "",
    art: "",
    gewichtung: "",
    ausbildungsfach: "",
    lernfeld: "",
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState("");

  const kennzahlenItem = (items) => {
    return items.map((item, index) => (
      <Grid container key={index} xs={12} spacing={2}>
        <Grid xs={8}>
          <Item>{item.name}</Item>
        </Grid>
        <Grid xs={4}>
          <Item>{item.schnitt}</Item>
        </Grid>
      </Grid>
    ));
  };

  const fachAuswahl = (items) => {
    return items.map()
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // Fetch Fächer
  useEffect(() => {
    const loadFaecher = async () => {
      setLoading(true);
      try {
        const response = await fetchAusbildungsfaecher();
        setFaecher(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Fehler beim Abrufen der Fächer");
      } finally {
        setLoading(false);
      }
    };
    loadFaecher();
  }, []);

  // Load user grades when component mounts
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGrades();
        setGrades(response.data);
      } catch (err) {
        setError("Fehler beim Abrufen der Noten");
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  // Add a new grade
  const handleAddGrade = async () => {
    try {
      const response = await addUserGrade(newGrade);
      setGrades((prevGrades) => [...prevGrades, response.data]); // Use functional state update
      setNewGrade({
        datum: "",
        wert: "",
        art: "",
        gewichtung: "",
        ausbildungsfach: "",
        lernfeld: "",
      });
      setError("");
    } catch (err) {
      setError("Fehler beim Hinzufügen der Note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Notenverwaltung</h1>
        </div>
      </header>
      <div className="px-8 py-8">
        <Box
          className="border-4 border-dashed px-3 py-3 border-gray-200 rounded-lg"
          sx={{ flexGrow: 1 }}
        >
          <Grid container spacing={2}>
            <Grid xs={6} container spacing={2} className="bg-red-100">
              <Grid xs={12} className="bg-green-100">
                <Item>Kennzahlen</Item>
              </Grid>
              {kennzahlenItem([
                { name: "Gesamt", schnitt: 1 },
                { name: "Allgemein", schnitt: 2 },
                { name: "Fachlich", schnitt: 1 },
              ])}
            </Grid>
            {/* Restliche Elemente */}
            <Grid xs={6} className="bg-slate-600">
              <Item>+</Item>
              <div class="inline-block relative w-64">
                <select class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
           
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
      {/* Anzeige der Notenliste */}
      <div className="grades-list">
        <h3>Alle Noten</h3>
        {grades.length === 0 ? (
          <p>Keine Noten vorhanden</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Note</th>
                <th>Art</th>
                <th>Gewichtung</th>
                <th>Fach</th>
                <th>Lernfeld</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.datum}</td>
                  <td>{grade.wert}</td>
                  <td>{grade.art}</td>
                  <td>{grade.gewichtung}</td>
                  <td>
                    {grade.ausbildungsfach
                      ? grade.ausbildungsfach.name
                      : "Unbekannt"}
                  </td>
                  <td>{grade.lernfeld || "Unbekannt"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <main>

          <Fachliste  />
      
      </main>
    </div>
  );
};

export default NotenPage;
