import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  ButtonGroup,
  Button,
} from "@mui/material";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import { calculateAverage } from "../../api_services/noten/calculations";

const Leaderboard = ({ allGrades, faecher }) => {
  const [view, setView] = useState("all");

  // Erzeuge pro Fach ein Ranking
  const leaderboardData = useMemo(() => {
    return faecher.map((subject) => {
      // Filter für dieses Fach
      const subjectGrades = allGrades.filter(
        (grade) =>
          grade.ausbildungsfach && grade.ausbildungsfach.id === subject.id
      );

      // Pro Azubi sammeln
      const grouped = {};
      subjectGrades.forEach((grade) => {
        if (grade.owner) {
          if (!grouped[grade.owner.id]) {
            grouped[grade.owner.id] = { owner: grade.owner, grades: [] };
          }
          grouped[grade.owner.id].grades.push(grade);
        }
      });

      // Durchschnitt, Anzahl etc.
      const ranking = Object.values(grouped)
        .map((item) => {
          const avg = calculateAverage(item.grades);
          const count = item.grades.length;
          return {
            owner: item.owner,
            avg: avg === "N/A" ? null : parseFloat(avg),
            count,
          };
        })
        .filter((item) => item.avg !== null)
        .sort((a, b) => a.avg - b.avg);

      return {
        subject: subject.name,
        rankings: ranking,
      };
    });
  }, [allGrades, faecher]);

  // Farben für Usernamen
  const usernameColors = [
    "#4caf50",
    "#2196f3",
    "#9c27b0",
    "#e91e63",
    "#795548",
    "#3f51b5",
    "#009688",
  ];

  // Gold, Silber, Bronze
  const rankColors = ["gold", "silver", "#cd7f32"];

  // Filter für Top3, Top10, Alle
  const getDisplayedRankings = (rankings) => {
    switch (view) {
      case "top3":
        return rankings.slice(0, 3);
      case "top10":
        return rankings.slice(0, 10);
      default:
        return rankings;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Leaderboard
      </Typography>

      {/* Umschalter für Top3 / Top10 / Alle */}
      <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
        <Button
          onClick={() => setView("top3")}
          variant={view === "top3" ? "contained" : "outlined"}
        >
          Top 3
        </Button>
        <Button
          onClick={() => setView("top10")}
          variant={view === "top10" ? "contained" : "outlined"}
        >
          Top 10
        </Button>
        <Button
          onClick={() => setView("all")}
          variant={view === "all" ? "contained" : "outlined"}
        >
          Alle
        </Button>
      </ButtonGroup>

      {/* Für jedes Fach eine Card */}
      {leaderboardData.map((subjectData, idx) => (
        <Paper
          key={idx}
          elevation={2}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            {subjectData.subject}
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Rang</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Durchschnittsnote
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Anzahl Bewertungen
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getDisplayedRankings(subjectData.rankings).map(
                (entry, rankIndex) => {
                  const userColor =
                    usernameColors[
                      entry.owner.username.length % usernameColors.length
                    ];

                  return (
                    <TableRow key={entry.owner.id}>
                      <TableCell sx={{ fontWeight: rankIndex < 3 ? "bold" : "normal" }}>
                        {rankIndex < 3 ? (
                          <StarPurple500Icon
                            sx={{
                              color: rankColors[rankIndex],
                              verticalAlign: "middle",
                              mr: 0.5,
                            }}
                          />
                        ) : (
                          `Platz ${rankIndex + 1}`
                        )}
                      </TableCell>
                      <TableCell sx={{ color: userColor }}>
                        {entry.owner.username}
                      </TableCell>
                      <TableCell>{entry.avg.toFixed(2)}</TableCell>
                      <TableCell>{entry.count}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Paper>
      ))}
    </Box>
  );
};

export default Leaderboard;
