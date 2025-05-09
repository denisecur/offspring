// src/components/PdfPreview.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PdfPreview = ({ pdfUrl, mode, onConfirm, onCancel }) => {

  console.log(mode); 

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="lg" fullWidth>
      <DialogTitle>PDF Vorschau</DialogTitle>
      <DialogContent dividers>
        {/* Das iframe zeigt das PDF inline an */}
        <iframe 
          src={pdfUrl} 
          title="PDF Vorschau" 
          width="100%" 
          height="600px" 
          style={{ border: 'none' }} 
        />
      </DialogContent>
      <DialogActions>
        {mode === "confirmation" && (
          <>
            <Button onClick={onCancel}>Schließen</Button>
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

// todo hier einbauen wenn neues create dann bestätigen /abbrechen (statt schließen) und wenn nur View dann ausschließlich schließen button