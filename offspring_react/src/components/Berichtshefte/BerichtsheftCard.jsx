// src/components/Berichtshefte/BerichtsheftCard.jsx
import React from "react";
import { format, getISOWeek } from "date-fns";

const BerichtshefteCard = ({
  reportDate,
  reportUrl,
  onUploadClick,
  fileInputRef,
  onFileChange,
  uploading,
  uploadError,
  onPreviewClick,
  allowUpload = true, // Standardmäßig erlauben
}) => {
  const kalenderwoche = getISOWeek(reportDate);
  return (
    <div
      className="bg-white p-4 shadow-md rounded-lg"
      style={{ backgroundColor: "var(--color-neutral)", color: "var(--color-text)" }}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold">{format(reportDate, "dd.MM.yyyy")}</div>
        {/* Nur anzeigen, wenn Upload erlaubt ist und noch kein Report vorhanden */}
        {allowUpload && !reportUrl && (
          <button
            onClick={onUploadClick}
            style={{ color: "var(--color-error)" }}
            className="py-2 px-4 rounded hover:underline"
          >
            Upload ⬆️
          </button>
        )}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
      </div>
      <div className="mt-1 text-sm">KW: {kalenderwoche}</div>
      <div className="mt-2">
        {reportUrl ? (
          <button
            onClick={() => onPreviewClick(reportUrl)}
            style={{ color: "var(--color-success)" }}
            className="hover:font-bold"
          >
            Vorschau
          </button>
        ) : (
          <div className="text-gray-500">ausstehend</div>
        )}
      </div>
      {uploading && <div className="text-sm text-blue-500">Upload läuft…</div>}
      {uploadError && (
        <div className="text-sm text-red-500">Upload-Fehler: {uploadError}</div>
      )}
    </div>
  );
};

export default BerichtshefteCard;
