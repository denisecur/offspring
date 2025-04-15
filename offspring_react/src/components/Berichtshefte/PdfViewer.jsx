// src/components/PdfViewer.jsx
import React, { useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // Legacy-Build verwenden
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// Konfiguriere den Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfViewer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
        try {
          const response = await fetch(pdfUrl);
          if (!response.ok) {
            throw new Error("Fehler beim Laden des PDFs");
          }
          const arrayBuffer = await response.arrayBuffer();
          // Hier wird die PDF-Daten als ArrayBuffer übergeben, nicht die URL:
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = { canvasContext: context, viewport: viewport };
          await page.render(renderContext).promise;
        } catch (error) {
          console.error("Fehler beim Rendern des PDFs:", error);
        }
      };
      

    loadPdf();
  }, [pdfUrl]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", border: "1px solid #ccc" }}
    />
  );
};

export default PdfViewer;
