// src/components/PdfPreview.jsx
import React from "react";

const PdfPreview = ({
  pdfUrl,
  mode = "preview", // "preview" oder "confirmation"
  onConfirm,
  onCancel,
  onClose,
}) => {
  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <h2>
            {mode === "confirmation"
              ? "Bitte Upload bestätigen"
              : "PDF-Vorschau"}
          </h2>
          {mode === "confirmation" && (
            <p>
              Wenn Sie dieses PDF hochladen, können Sie es später nicht mehr
              ändern. Sind Sie sicher, dass Sie fortfahren möchten?
            </p>
          )}
        </div>
        <div style={{ width: "100%", height: "500px" }}>
          <iframe
            src={pdfUrl}
            title="PDF Vorschau"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </div>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          {mode === "confirmation" ? (
            <>
              <button onClick={onConfirm} style={{ marginRight: "1rem" }}>
                Ja, hochladen
              </button>
              <button onClick={onCancel}>Abbrechen</button>
            </>
          ) : (
            <button onClick={onClose}>Schließen</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
