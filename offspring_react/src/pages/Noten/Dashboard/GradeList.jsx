import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const GradeList = ({ grades, faecher, leistungsnachweise }) => {
  return (
    <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.paper" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
        Notenliste
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>Fach</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>Note</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>Art</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>Datum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}>
                <TableCell>{faecher.find((f) => f.id === grade.ausbildungsfach?.id)?.name || "Unbekannt"}</TableCell>
                <TableCell>{grade.wert}</TableCell>
                <TableCell>{leistungsnachweise.find((l) => l.art === grade.art)?.art || "Unbekannt"}</TableCell>
                <TableCell>{new Date(grade.datum).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GradeList;