import React, { useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";

// Hilfsfunktion: Ermittelt das früheste Notendatum eines Azubis
function getEarliestGradeDateForUser(userId, grades) {
  const userGrades = grades.filter(
    (g) => g.owner && g.owner.id === userId && g.datum
  );
  if (!userGrades.length) return null;
  const earliestTime = Math.min(
    ...userGrades.map((g) => new Date(g.datum).getTime())
  );
  return new Date(earliestTime);
}

// Bestimmt das Startjahr: Falls kein Datum vorhanden, "Nicht zuordbar"
function getClassYear(dateObj) {
  if (!dateObj) return "Nicht zuordbar";
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  return month < 7 ? year - 1 : year;
}

const AzubiStartTable = ({ grades }) => {
  // Extrahiere alle eindeutigen Azubis
  const azubis = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      if (g.owner && !map[g.owner.id]) {
        map[g.owner.id] = g.owner;
      }
    });
    return Object.values(map);
  }, [grades]);

  // Für jeden Azubi: Bestimme das früheste Datum und daraus das Startjahr
  const data = useMemo(() => {
    return azubis.map((azubi) => {
      const earliest = getEarliestGradeDateForUser(azubi.id, grades);
      const startYear = getClassYear(earliest);
      return { ...azubi, startYear };
    });
  }, [azubis, grades]);

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Übersicht: Azubi-Startjahre
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Azubi</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Startjahr</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((azubi) => (
              <TableRow key={azubi.id}>
                <TableCell>{azubi.username}</TableCell>
                <TableCell>{azubi.startYear}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default AzubiStartTable;
