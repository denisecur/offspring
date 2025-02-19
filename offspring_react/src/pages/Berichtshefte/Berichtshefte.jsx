// src/components/Berichtshefte.jsx
import React, { useState, useRef } from "react";
import { getMonth } from "date-fns";
import { getToken } from "../../helpers";
import getThemeColors from "../../config/theme";
import { calculateWeekDate, getStartOfWeekFromDate, generateWeekKey } from "../../utils/dateUtils";
import { useBerichtshefte } from "../../hooks/useBerichtshefte";
import BerichtshefteCard from "../../components/Berichtshefte/BerichtsheftCard";
import PdfPreview from "../../components/PdfPreview";
import { uploadReport } from "../../api_services/berichtshefte/berichtshefteService";

const Berichtshefte = () => {
  const token = getToken();
  getThemeColors(localStorage.getItem("theme") || "basicLight");

  // Zustände für Jahr- und Monatsauswahl
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0);

  // Custom Hook zum Laden der Berichtshefte
  const { reports, loading, error, setReports } = useBerichtshefte(token);

  // Basisstartdaten und Berechnung des Wochenstarts
  const baseDates = [
    new Date(2023, 8, 1),
    new Date(2024, 8, 1),
    new Date(2025, 8, 1),
  ];
  const startDates = baseDates.map(date => getStartOfWeekFromDate(date));

  // File-Input Refs, um die versteckten Input-Felder anzusprechen
  const fileInputRefs = useRef({});

  // Zustände für PDF-Vorschau und Upload
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReportDate, setSelectedReportDate] = useState(null);
  const [selectedWeekKey, setSelectedWeekKey] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Beim Datei-Select: Speichere die Datei, prüfe den Typ und zeige die Vorschau
  const handleFileChange = (event, weekKey, reportDate) => {
    const file = event.target.files[0];
    if (file) {
      // Nur PDF-Dateien erlauben
      if (file.type !== "application/pdf") {
        alert("Bitte wähle eine PDF-Datei aus.");
        return;
      }
      setSelectedFile(file);
      setSelectedReportDate(reportDate);
      setSelectedWeekKey(weekKey);
      const fileUrl = URL.createObjectURL(file);
      setSelectedPdfUrl(fileUrl);
      setShowPreview(true);
    }
  };

  // Bestätigung: Führe den Upload aus
  const handleConfirmUpload = async () => {
    setShowPreview(false);
    setUploading(true);
    try {
      const result = await uploadReport(token, selectedFile, selectedReportDate);
      let pdfUrl = null;
      const pdfData = result.data.attributes.pdf;
      // Je nach Strapi-Antwortstruktur:
      if (pdfData && pdfData.data) {
        if (Array.isArray(pdfData.data) && pdfData.data.length > 0) {
          pdfUrl = pdfData.data[0].attributes.url;
        } else {
          pdfUrl = pdfData.data.attributes.url;
        }
      }
      if (!pdfUrl) {
        throw new Error("PDF-URL nicht gefunden");
      }
      if (!pdfUrl.startsWith("http")) {
        pdfUrl = `http://localhost:1337${pdfUrl}`;
      }
      // Aktualisiere den Zustand der Berichtshefte mit der neuen PDF-URL
      setReports(prev => ({ ...prev, [selectedWeekKey]: pdfUrl }));
    } catch (err) {
      console.error("Fehler beim Upload:", err);
      alert("Fehler beim Upload: " + err.message);
    } finally {
      // Setze alle selektierten Zustände zurück
      setUploading(false);
      setSelectedFile(null);
      setSelectedPdfUrl(null);
      setSelectedReportDate(null);
      setSelectedWeekKey(null);
    }
  };

  // Abbruch: Schließe die Vorschau und verwerfe die Auswahl
  const handleCancelUpload = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setSelectedPdfUrl(null);
    setSelectedReportDate(null);
    setSelectedWeekKey(null);
  };

  const months = [
    "September", "Oktober", "November", "Dezember",
    "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-base-100)" }}>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>
            Ausbildungsnachweise
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading && <div>Lade Berichtshefte...</div>}
          {error && <div className="text-red-500">Fehler: {error}</div>}

          {/* Jahr-Auswahl */}
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map(year => (
              <button
                key={year}
                className="py-2 px-4 rounded flex-grow"
                style={{
                  backgroundColor: selectedYear === year ? "var(--color-primary)" : "#e5e7eb",
                  color: selectedYear === year ? "#fff" : "#000"
                }}
                onClick={() => { setSelectedYear(year); setSelectedMonth(0); }}
              >
                Jahr {year}
              </button>
            ))}
          </div>

          {/* Monats-Auswahl */}
          <div className="flex justify-between mb-4">
            {months.map((month, index) => (
              <button
                key={month}
                className="py-2 px-4 rounded flex-grow"
                style={{
                  backgroundColor: selectedMonth === index ? "var(--color-accent)" : "#e5e7eb",
                  color: selectedMonth === index ? "#fff" : "#000"
                }}
                onClick={() => setSelectedMonth(index)}
              >
                {month}
              </button>
            ))}
          </div>

          {/* Anzeige der Berichtskarten */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 52 }, (_, i) => {
              const reportDate = calculateWeekDate(startDates[selectedYear - 1], i + 1);
              const academicMonthIndex = (getMonth(reportDate) + 4) % 12;
              if (academicMonthIndex !== selectedMonth) return null;
              const weekKey = generateWeekKey(reportDate);
              return (
                <BerichtshefteCard
                  key={i}
                  reportDate={reportDate}
                  reportUrl={reports[weekKey]}
                  onUploadClick={() => {
                    if (fileInputRefs.current[weekKey]) {
                      fileInputRefs.current[weekKey].click();
                    }
                  }}
                  fileInputRef={el => fileInputRefs.current[weekKey] = el}
                  onFileChange={(e) => handleFileChange(e, weekKey, reportDate)}
                />
              );
            })}
          </div>

          {/* Anzeige, wenn gerade hochgeladen wird */}
          {uploading && <div className="mt-4 text-center">Upload läuft...</div>}
        </div>
      </main>

      {/* PDF-Vorschau im Confirmation-Modus */}
      {showPreview && selectedPdfUrl && (
        <PdfPreview
          pdfUrl={selectedPdfUrl}
          mode="confirmation"
          onConfirm={handleConfirmUpload}
          onCancel={handleCancelUpload}
        />
      )}
    </div>
  );
};

export default Berichtshefte;
