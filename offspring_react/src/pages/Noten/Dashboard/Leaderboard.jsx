import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { calculateAverage } from "../../../api_services/noten/calculations";

const Leaderboard = ({ allGrades, faecher }) => {
  // Erstelle für jedes Fach eine Rangliste
  const leaderboardData = useMemo(() => {
    return faecher.map((subject) => {
      // Filtere alle Noten für dieses Fach
      const subjectGrades = allGrades.filter(
        (grade) => grade.ausbildungsfach?.id === subject.id
      );

      // Gruppiere die Noten nach Azubi (owner)
      const grouped = {};
      subjectGrades.forEach((grade) => {
        if (grade.owner) {
          if (!grouped[grade.owner.id]) {
            grouped[grade.owner.id] = { owner: grade.owner, grades: [] };
          }
          grouped[grade.owner.id].grades.push(grade);
        }
      });

      // Berechne pro Azubi den Durchschnitt und die Anzahl Bewertungen
      const ranking = Object.values(grouped)
        .map((item) => {
          const avg = calculateAverage(item.grades);
          const count = item.grades.length;
          return { owner: item.owner, avg: avg === "N/A" ? null : parseFloat(avg), count };
        })
        .filter((item) => item.avg !== null);

      // Sortiere nach Durchschnittsnote (niedriger = besser)
      ranking.sort((a, b) => a.avg - b.avg);

      return {
        subject: subject.name,
        rankings: ranking,
      };
    });
  }, [allGrades, faecher]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Leaderboard / Rangliste
      </Typography>
      {leaderboardData.map((subjectData, index) => (
        <Paper key={index} sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {subjectData.subject}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rang</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Durchschnittsnote</TableCell>
                <TableCell>Anzahl Bewertungen</TableCell>
                <TableCell>Verbesserungspotenzial</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjectData.rankings.map((entry, rankIndex) => (
                <TableRow key={entry.owner.id}>
                  <TableCell>
                    {rankIndex === 0 ? "Spitzenreiter" : `Platz ${rankIndex + 1}`}
                  </TableCell>
                  <TableCell>{entry.owner.username}</TableCell>
                  <TableCell>{entry.avg.toFixed(2)}</TableCell>
                  <TableCell>{entry.count}</TableCell>
                  <TableCell>
                    {/* Hier kannst du später das Verbesserungspotenzial berechnen */}
                    N/A
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ))}
    </Box>
  );
};

export default Leaderboard;
