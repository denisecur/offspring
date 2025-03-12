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
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import { calculateAverage } from "../../../api_services/noten/calculations";

const Leaderboard = ({ allGrades, faecher }) => {
  const leaderboardData = useMemo(() => {
    return faecher.map((subject) => {
      const subjectGrades = allGrades.filter(
        (grade) => grade.ausbildungsfach && grade.ausbildungsfach.id === subject.id
      );

      const grouped = {};
      subjectGrades.forEach((grade) => {
        if (grade.owner) {
          if (!grouped[grade.owner.id]) {
            grouped[grade.owner.id] = { owner: grade.owner, grades: [] };
          }
          grouped[grade.owner.id].grades.push(grade);
        }
      });

      const ranking = Object.values(grouped)
        .map((item) => {
          const avg = calculateAverage(item.grades);
          const count = item.grades.length;
          return { owner: item.owner, avg: avg === "N/A" ? null : parseFloat(avg), count };
        })
        .filter((item) => item.avg !== null)
        .sort((a, b) => a.avg - b.avg);

      return {
        subject: subject.name,
        rankings: ranking,
      };
    });
  }, [allGrades, faecher]);

  const usernameColors = ["#4caf50", "#2196f3", "#9c27b0", "#e91e63", "#795548", "#3f51b5", "#009688"];

  const [view, setView] = useState("all");

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

  const rankColors = ["gold", "silver", "#cd7f32"];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Leaderboard / Rangliste
      </Typography>
      <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
        <Button onClick={() => setView("top3")}>Top 3</Button>
        <Button onClick={() => setView("top10")}>Top 10</Button>
        <Button onClick={() => setView("all")}>Alle</Button>
      </ButtonGroup>
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
              {getDisplayedRankings(subjectData.rankings).map((entry, rankIndex) => {
                const userColor = usernameColors[entry.owner.username.length % usernameColors.length];

                 return (
                  <TableRow key={entry.owner.id}>
                    <TableCell style={{ fontWeight: rankIndex < 3 ? "bold" : "normal" }}>
                      {rankIndex < 3 && (
                        <StarPurple500Icon sx={{ color: rankColors[rankIndex], verticalAlign: "middle" }} />
                      )}
                      {rankIndex >= 3 && `Platz ${rankIndex + 1}`}
                    </TableCell>
                    <TableCell style={{ color: userColor }}>{entry.owner.username}</TableCell>
                    <TableCell>{entry.avg.toFixed(2)}</TableCell>
                    <TableCell>{entry.count}</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      ))}
    </Box>
  );
};

export default Leaderboard;