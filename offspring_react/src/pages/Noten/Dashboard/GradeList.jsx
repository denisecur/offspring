// src/components/Noten/GradeList.js

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

// MUI Date Picker (optional für Datumsfilter)
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

// Unsere Services
import {
  updateUserGrade,
  deleteUserGrade,
} from "../../../api_services/noten/notenService";

const GradeList = ({ grades, setGrades, faecher, leistungsnachweise }) => {
  // FILTER
  const [selectedFach, setSelectedFach] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // EDIT-DIALOG
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editableGrade, setEditableGrade] = useState(null);

  // ---------------- FILTER-LOGIK ----------------
  const handleFachFilterChange = (event) => {
    setSelectedFach(event.target.value);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const filteredGrades = grades.filter((grade) => {
    // 1) Fach
    if (selectedFach && grade.ausbildungsfach?.id !== selectedFach) {
      return false;
    }
    // 2) Datum
    const gradeDate = new Date(grade.datum);
    if (startDate && gradeDate < startDate) return false;
    if (endDate && gradeDate > endDate) return false;
    return true;
  });

  // ---------------- BEARBEITEN ----------------
  const openEditDialog = (grade) => {
    setEditableGrade({
      ...grade,
      ausbildungsfach: grade.ausbildungsfach?.id || "",
    });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditableGrade(null);
  };

  const handleEditChange = (field, value) => {
    setEditableGrade((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editableGrade) return;
    try {
      const response = await updateUserGrade(editableGrade.id, {
        wert: editableGrade.wert,
        art: editableGrade.art,
        datum: editableGrade.datum,
        ausbildungsfach: editableGrade.ausbildungsfach, 
      });
      // => response = { data: { id, wert, art, datum, ausbildungsfach: {...} } }

      if (response && response.data) {
        const updatedItem = response.data;

        // Lokalen State aktualisieren
        setGrades((prev) =>
          prev.map((g) => (g.id === updatedItem.id ? updatedItem : g))
        );
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Note:", error);
    }
    closeEditDialog();
  };

  // ---------------- LÖSCHEN ----------------
  const handleDelete = async (gradeId) => {
    if (!window.confirm("Soll diese Note wirklich gelöscht werden?")) return;
    try {
      await deleteUserGrade(gradeId);
      // Lokal entfernen
      setGrades((prev) => prev.filter((g) => g.id !== gradeId));
    } catch (error) {
      console.error("Fehler beim Löschen der Note:", error);
    }
  };
  

  return (
    <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.paper" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Notenliste
      </Typography>

      {/* FILTER-UI */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="fach-filter-label">Fach</InputLabel>
          <Select
            labelId="fach-filter-label"
            label="Fach"
            value={selectedFach}
            onChange={handleFachFilterChange}
          >
            <MenuItem value="">Alle Fächer</MenuItem>
            {faecher.map((fach) => (
              <MenuItem key={fach.id} value={fach.id}>
                {fach.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Startdatum"
            inputFormat="dd.MM.yyyy"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="Enddatum"
            inputFormat="dd.MM.yyyy"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      {/* TABELLE */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>
                Fach
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>
                Note
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>
                Art
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>
                Datum
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "common.white" }}>
                Aktionen
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGrades.map((grade) => {
              // Fach-Namen
              const fachName =
                faecher.find((f) => f.id === grade.ausbildungsfach?.id)
                  ?.name || "Unbekannt";

              // Art
              const artName =
                leistungsnachweise.find((l) => l.art === grade.art)?.art ||
                "Unbekannt";

              return (
                <TableRow
                  key={grade.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell>{fachName}</TableCell>
                  <TableCell>{grade.wert}</TableCell>
                  <TableCell>{artName}</TableCell>
                  <TableCell>
                    {new Date(grade.datum).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => openEditDialog(grade)}
                      sx={{ mr: 1 }}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(grade.id)}
                    >
                      Löschen
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EDIT-DIALOG */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth>
        <DialogTitle>Note bearbeiten</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {editableGrade && (
            <>
              {/* Fach */}
              <FormControl fullWidth>
                <InputLabel id="fach-edit-label">Fach</InputLabel>
                <Select
                  labelId="fach-edit-label"
                  label="Fach"
                  value={editableGrade.ausbildungsfach || ""}
                  onChange={(e) =>
                    handleEditChange("ausbildungsfach", e.target.value)
                  }
                >
                  {faecher.map((fach) => (
                    <MenuItem key={fach.id} value={fach.id}>
                      {fach.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Note */}
              <TextField
                label="Note"
                type="number"
                value={editableGrade.wert}
                onChange={(e) => handleEditChange("wert", e.target.value)}
              />

              {/* Art */}
              <FormControl fullWidth>
                <InputLabel id="art-edit-label">Art</InputLabel>
                <Select
                  labelId="art-edit-label"
                  label="Art"
                  value={editableGrade.art || ""}
                  onChange={(e) => handleEditChange("art", e.target.value)}
                >
                  {leistungsnachweise.map((l) => (
                    <MenuItem key={l.id} value={l.art}>
                      {l.art}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Datum */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Datum"
                  inputFormat="dd.MM.yyyy"
                  value={new Date(editableGrade.datum)}
                  onChange={(date) =>
                    handleEditChange("datum", date?.toISOString() || "")
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Abbrechen</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GradeList;
