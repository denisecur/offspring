// src/components/PdfPreview.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import PdfViewer from "./PdfViewer";

const PdfPreview = ({ pdfUrl, mode, onConfirm, onCancel }) => {
  return (
    <Dialog open={true} onClose={onCancel} maxWidth="lg" fullWidth>
      <DialogTitle>PDF Vorschau</DialogTitle>
      <DialogContent dividers>
        <PdfViewer pdfUrl={pdfUrl} />
      </DialogContent>
      <DialogActions>
        {mode === "confirmation" && (
          <>
            <Button onClick={onCancel}>Abbrechen</Button>
            <Button onClick={onConfirm} variant="contained" color="primary">
              Bestätigen
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PdfPreview;
