import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Grid, Paper, Card, CardContent, Divider } from "@mui/material";
import { fetchUserGrades } from "../../../api_services/noten/notenService";
import { fetchAusbildungsDetails } from "../../../api_services/noten/ausbildungsfaecherService";
import CompetitiveComparisonBarChart from "./CompetitiveComparisonBarChart";
import CompetitiveComparison from "./CompetitiveComparison";
import LineGraph2 from "../../../components/Dashboard/LineGraph2";
import AzubiStartTable from "./AzubiStartTable";
// --- Hilfsfunktionen ---

// Ermittelt das früheste Notendatum eines Azubis (nur wenn datum vorhanden)
function getEarliestGradeDateForUser(userId, grades) {
  const userGrades = grades.filter((g) => g.owner && g.owner.id === userId && g.datum);
  if (!userGrades.length) return null;
  const earliestTime = Math.min(...userGrades.map((g) => new Date(g.datum).getTime()));
  return new Date(earliestTime);
}

function getClassYear(dateObj) {
  if (!dateObj) return "Nicht zuordbar";
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  return month < 7 ? year - 1 : year;
}

// Berechnet den gewichteten Durchschnitt (z. B. 1,5, 2, etc.)
function calculateWeightedAverage(grades) {
  if (!grades.length) return null;
  const totalWeightedSum = grades.reduce(
    (sum, grade) => sum + parseFloat(grade.wert) * (grade.gewichtung || 1),
    0
  );
  const totalWeight = grades.reduce(
    (sum, grade) => sum + (grade.gewichtung || 1),
    0
  );
  return totalWeight ? totalWeightedSum / totalWeight : null;
}

// Ermittelt den besten Azubi (mit niedrigstem Durchschnitt) in einer Gruppe
function getBestAzubiByAverage(grades) {
  if (!grades.length) return null;
  const userGrades = {};
  grades.forEach((g) => {
    if (!g.owner?.id) return;
    const uid = g.owner.id;
    if (!userGrades[uid]) userGrades[uid] = [];
    userGrades[uid].push(g);
  });
  let bestAzubi = null;
  let bestAvg = Infinity;
  Object.values(userGrades).forEach((gradeArray) => {
    const avg = calculateWeightedAverage(gradeArray);
    console.log(`Azubi ${gradeArray[0].owner.username} Durchschnitt: ${avg}`);
    if (avg !== null && avg < bestAvg) {
      bestAvg = avg;
      bestAzubi = gradeArray[0].owner;
    }
  });
  return bestAzubi;
}

const ausbildungsfaecherMapping = {
  // Büromanagement
  "deutsch": "Büromanagement",
  "englisch": "Büromanagement",
  "betriebs- und gesamtwirtschaftliche prozesse": "Büromanagement",
  "kundengewinnung und geschäftsprozesse": "Büromanagement",
  "geschäftsprozesse und kommunikation": "Büromanagement",
  "büromanagementprozesse": "Büromanagement",
  "religionslehre": "Büromanagement",
  "sport": "Büromanagement",
  // Versicherungen und Finanzanlagen
  "sach- und vermögensversicherungen": "Versicherungen und Finanzanlagen",
  "personenversicherungen mit finanzanlagen": "Versicherungen und Finanzanlagen",
  "politik und gesellschaft": "Versicherungen und Finanzanlagen",
  "kaufmännische steuerung und kontrolle": "Versicherungen und Finanzanlagen",
};

function getAusbildungsrichtung(grade) {
  if (grade.ausbildungsfach && grade.ausbildungsfach.name) {
    const fachName = grade.ausbildungsfach.name.toLowerCase().trim();
    if (ausbildungsfaecherMapping[fachName]) {
      return ausbildungsfaecherMapping[fachName];
    }
  }
  return "Unbekannt";
}

// Filtere gültige Noten (Owner vorhanden und Ausbildungsrichtung ableitbar)
const validGrades = (grades) =>
  grades.filter((g) => g.owner && getAusbildungsrichtung(g) !== "Unbekannt");

// Gruppiere Noten primär nach Ausbildungsstart und innerhalb eines Startjahres nach Ausbildungsrichtung
const groupByStartYear = (grades) => {
  const result = {};
  grades.forEach((grade) => {
    const earliest = getEarliestGradeDateForUser(grade.owner.id, grades);
    const startYear = getClassYear(earliest);
    if (!result[startYear]) result[startYear] = {};
    const direction = getAusbildungsrichtung(grade);
    if (!result[startYear][direction]) result[startYear][direction] = [];
    result[startYear][direction].push(grade);
  });
  Object.entries(result).forEach(([year, directions]) => {
    Object.entries(directions).forEach(([direction, gradeArr]) => {
      result[year][direction] = {
        grades: gradeArr,
        average: calculateWeightedAverage(gradeArr),
        bestAzubi: getBestAzubiByAverage(gradeArr),
      };
    });
  });
  return result;
};

// --- Komponenten ---

// Für jeden Ausbildungsstart wird ein Abschnitt mit Karten pro Ausbildungsrichtung angezeigt.
const YearSection = ({ startYear, groups }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ausbildungsstart: {startYear}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(groups).map(([direction, groupData]) => (
          <Grid item xs={12} sm={6} md={4} key={`${startYear}-${direction}`}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {direction}
                </Typography>
                <Typography variant="body2">
                  <strong>Ø-Schnitt:</strong>{" "}
                  {groupData.average ? groupData.average.toFixed(2) : "--"}
                </Typography>
                <Typography variant="body2">
                  <strong>Bester Azubi:</strong>{" "}
                  {groupData.bestAzubi ? groupData.bestAzubi.username : "--"}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <LineGraph2
                  grades={groupData.grades}
                  subjectName={`${direction} – Start ${startYear}`}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default function CompetitiveOverview() {
  const [allGrades, setAllGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const gradesRes = await fetchUserGrades();
        console.log("API Response (Noten):", gradesRes.data);
        const loadedGrades = gradesRes.data.map((item) => {
          const attr = item.attributes || item;
          return {
            id: item.id,
            wert: attr.wert,
            datum: attr.datum,
            owner: attr.owner || null,
            ausbildungsfach: attr.ausbildungsfach || null,
          };
        });
        console.log("Loaded Grades:", loadedGrades);
        setAllGrades(loadedGrades);

        const details = await fetchAusbildungsDetails();
        console.log("Ausbildungsdetails:", details);
        setFaecher(details.faecher);
      } catch (err) {
        console.error(err);
        setError(err.message || "Fehler beim Laden der Daten");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const valid = useMemo(() => validGrades(allGrades), [allGrades]);
  const groupedData = useMemo(() => groupByStartYear(valid), [valid]);
  const sortedYears = useMemo(
    () => Object.keys(groupedData).sort((a, b) => b - a),
    [groupedData]
  );

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Lade Daten...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Wettbewerbs-Übersicht
      </Typography>
      {sortedYears.map((year) => (
        <YearSection key={year} startYear={year} groups={groupedData[year]} />
      ))}
      <Divider sx={{ my: 2 }} />
      <CompetitiveComparisonBarChart allGrades={allGrades} faecher={faecher} />
      <Divider sx={{ my: 2 }} />
      <CompetitiveComparison allGrades={allGrades} />
      <Divider sx={{ my: 2 }} />
      <AzubiStartTable grades={allGrades} />
    </Box>
  );
}
