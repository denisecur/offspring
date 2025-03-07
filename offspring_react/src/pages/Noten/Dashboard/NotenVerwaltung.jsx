import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

// Services
import { updateUserGrade, deleteUserGrade } from "../../../api_services/noten/notenService";
import AddGradeForm from "../AddGradeForm";

const NotenVerwaltung = ({ grades, setGrades, faecher, leistungsnachweise, onAddGrade }) => {
  // Filter-States
  const [selectedFach, setSelectedFach] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Sortier-States
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Datum");

  // Bearbeiten-Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editableGrade, setEditableGrade] = useState(null);

  // Schuljahr ermitteln (z. B. "2023/2024")
  const getSchoolYear = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = d.getMonth();
    return m >= 8 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
  };

  // Filtered Grades (vor Sortierung)
  const filteredGrades = useMemo(() => {
    return grades.filter((grade) => {
      if (selectedFach && grade.ausbildungsfach?.id !== selectedFach) return false;
      if (selectedYear) {
        const gy = getSchoolYear(grade.datum);
        if (gy !== selectedYear) return false;
      }
      const d = new Date(grade.datum);
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    });
  }, [grades, selectedFach, selectedYear, startDate, endDate]);

  // Sortier-Komparator
  const getComparator = (order, orderBy) => {
    return (a, b) => {
      let valueA, valueB;
      switch (orderBy) {
        case "Fach":
          valueA = (faecher.find((f) => f.id === a.ausbildungsfach?.id)?.name || "").toLowerCase();
          valueB = (faecher.find((f) => f.id === b.ausbildungsfach?.id)?.name || "").toLowerCase();
          break;
        case "Note":
          valueA = parseFloat(a.wert);
          valueB = parseFloat(b.wert);
          break;
        case "Art":
          valueA = a.art.toLowerCase();
          valueB = b.art.toLowerCase();
          break;
        case "Datum":
          valueA = new Date(a.datum).getTime();
          valueB = new Date(b.datum).getTime();
          break;
        default:
          return 0;
      }
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    };
  };

  // Sorted and filtered Grades
  const sortedFilteredGrades = useMemo(() => {
    return [...filteredGrades].sort(getComparator(order, orderBy));
  }, [filteredGrades, order, orderBy]);

  // handleRequestSort: Wechsel der Sortierreihenfolge und des Sortierkriteriums
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Gesamtdurchschnitt berechnen (optional)
  const calculateAverage = (arr) => {
    if (!arr.length) return 0;
    let sum = 0, weight = 0;
    for (let g of arr) {
      const w = g.gewichtung || 1;
      sum += parseFloat(g.wert) * w;
      weight += w;
    }
    return weight === 0 ? 0 : (sum / weight).toFixed(2);
  };
  const overallAverage = calculateAverage(sortedFilteredGrades);

  // Bearbeitungsfunktionen
  const openEditDialogFn = (grade) => {
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
      if (response && response.data) {
        const updated = response.data;
        const updatedId = updated.id;
        const attrs = updated.attributes;
        const updatedGrade = {
          id: updatedId,
          wert: attrs.wert,
          art: attrs.art,
          datum: attrs.datum,
          ausbildungsfach: attrs.ausbildungsfach?.data ? { id: attrs.ausbildungsfach.data.id } : null,
        };
        setGrades((prev) =>
          prev.map((g) => (g.id === updatedId ? updatedGrade : g))
        );
      }
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Note:", err);
      alert("Fehler beim Aktualisieren der Note: " + err.message);
    } finally {
      closeEditDialog();
    }
  };
  const handleDelete = async (gradeId) => {
    if (!window.confirm("Soll diese Note wirklich gelöscht werden?")) return;
    try {
      await deleteUserGrade(gradeId);
      setGrades((prev) => prev.filter((g) => g.id !== gradeId));
    } catch (error) {
      console.error("Fehler beim Löschen der Note:", error);
      alert("Fehler beim Löschen der Note: " + error.message);
    }
  };

  // Hilfsfunktionen
  const getFachName = (grade) => {
    const f = faecher.find((f) => f.id === grade.ausbildungsfach?.id);
    return f ? f.name : "Unbekannt";
  };
  const getArtName = (grade) => {
    const ln = leistungsnachweise.find((l) => l.art === grade.art);
    return ln ? ln.art : "Unbekannt";
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {/* Formular zum Hinzufügen einer neuen Note */}
      <Paper sx={{ p: 2, mb: 3, width: "100%" }}>
        <AddGradeForm
          faecher={faecher}
          leistungsnachweise={leistungsnachweise}
          onAddGrade={onAddGrade}
        />
      </Paper>

      {/* Filter-Bereich */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Fach</InputLabel>
            <Select
              label="Fach"
              value={selectedFach}
              onChange={(e) => setSelectedFach(e.target.value)}
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
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <DesktopDatePicker
              label="Enddatum"
              inputFormat="dd.MM.yyyy"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </Paper>

      {/* Tabelle mit Sortierung */}
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "primary.light",
                  "& th": { color: "common.white", fontWeight: "bold" },
                }}
              >
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "Fach"}
                    direction={orderBy === "Fach" ? order : "asc"}
                    onClick={() => handleRequestSort("Fach")}
                  >
                    Fach
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "Note"}
                    direction={orderBy === "Note" ? order : "asc"}
                    onClick={() => handleRequestSort("Note")}
                  >
                    Note
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "Art"}
                    direction={orderBy === "Art" ? order : "asc"}
                    onClick={() => handleRequestSort("Art")}
                  >
                    Art
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "Datum"}
                    direction={orderBy === "Datum" ? order : "asc"}
                    onClick={() => handleRequestSort("Datum")}
                  >
                    Datum
                  </TableSortLabel>
                </TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFilteredGrades.map((grade) => (
                <TableRow
                  key={grade.id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell>{getFachName(grade)}</TableCell>
                  <TableCell>{grade.wert}</TableCell>
                  <TableCell>{getArtName(grade)}</TableCell>
                  <TableCell>{new Date(grade.datum).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => openEditDialogFn(grade)}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(grade.id)}
                    >
                      Löschen
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bearbeiten-Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Note bearbeiten</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {editableGrade && (
            <>
              <FormControl size="small" fullWidth>
                <InputLabel>Fach</InputLabel>
                <Select
                  label="Fach"
                  value={editableGrade.ausbildungsfach || ""}
                  onChange={(e) => handleEditChange("ausbildungsfach", e.target.value)}
                >
                  {faecher.map((fach) => (
                    <MenuItem key={fach.id} value={fach.id}>
                      {fach.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Note"
                type="number"
                value={editableGrade.wert}
                onChange={(e) => handleEditChange("wert", e.target.value)}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Art</InputLabel>
                <Select
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Datum"
                  inputFormat="dd.MM.yyyy"
                  value={new Date(editableGrade.datum)}
                  onChange={(date) =>
                    handleEditChange("datum", date ? date.toISOString() : "")
                  }
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
              </LocalizationProvider>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={closeEditDialog}>Abbrechen</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotenVerwaltung;
