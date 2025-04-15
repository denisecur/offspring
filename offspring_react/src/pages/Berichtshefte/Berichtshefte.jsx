import React, { useState, useRef, useEffect } from "react";
import { getMonth } from "date-fns";
import { getToken, getCurrentUser } from "../../helpers";
import getThemeColors from "../../config/theme";
import {
  calculateWeekDate,
  getStartOfWeekFromDate,
  generateWeekKey,
} from "../../utils/dateUtils";
import { useBerichtshefte } from "../../hooks/useBerichtshefte";
import BerichtshefteCard from "../../components/Berichtshefte/BerichtsheftCard";
import PdfPreview from "../../components/PdfPreview";
import { uploadReport } from "../../api_services/berichtshefte/berichtshefteService";
import { fetchVorlage } from "../../api_services/vorlagen/vorlageService";

const Berichtshefte = ({ azubi, allowUpload = true }) => {
  // Falls kein azubi-Prop übergeben wird, verwende den aktuell angemeldeten Benutzer
  const currentAzubi = azubi || getCurrentUser();
  useEffect(() => {
    console.log("🔄 Berichtshefte neu gerendert mit Azubi:", currentAzubi);
  }, [currentAzubi]);
  console.log("Erhaltener Azubi in Berichtshefte:", currentAzubi);
  if (!currentAzubi) return <div>Lade Azubi-Daten...</div>;

  const token = getToken();
  getThemeColors(localStorage.getItem("theme") || "basicLight");

  // Vorlage (Download) laden – nur relevant, wenn kein Azubi übergeben wird
  const [vorlage, setVorlage] = useState(null);
  useEffect(() => {
    const getVorlageData = async () => {
      try {
        const vorlagenResponse = await fetchVorlage();
        if (vorlagenResponse.data && vorlagenResponse.data.length > 0) {
          setVorlage(vorlagenResponse.data[0]);
        } else {
          console.error("Keine Vorlage gefunden");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Vorlage:", error);
      }
    };
    getVorlageData();
  }, []);

  // Jahr/Monat-Auswahl
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0);

  // Daten aus dem Custom Hook – currentAzubi wird übergeben
  const { reports, loading, error, setReports } = useBerichtshefte(token, currentAzubi);

  // Start-Daten für 3 Lehrjahre (je September)
  const baseDates = [
    new Date(2023, 8, 1),
    new Date(2024, 8, 1),
    new Date(2025, 8, 1),
  ];
  const startDates = baseDates.map((date) => getStartOfWeekFromDate(date));

  // Upload-States & Refs
  const fileInputRefs = useRef({});
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReportDate, setSelectedReportDate] = useState(null);
  const [selectedWeekKey, setSelectedWeekKey] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Vorlage-Vorschau öffnen (wird nur genutzt, wenn kein Azubi übergeben wird)
  const handleDownloadTemplate = () => {
    if (!vorlage || !vorlage.attributes) {
      console.error("Vorlage nicht geladen");
      return;
    }
    let pdfUrl = "";
    if (vorlage.attributes.pdf && vorlage.attributes.pdf.data) {
      pdfUrl = vorlage.attributes.pdf.data.attributes.url;
    } else {
      pdfUrl = `/uploads/${vorlage.attributes.name}.pdf`;
    }
    if (!pdfUrl.startsWith("http")) {
      pdfUrl = `http://localhost:1337${pdfUrl}`;
    }
    setSelectedPdfUrl(pdfUrl);
    setShowPreview(true);
  };

  // File-Change Handler (Upload & Vorschau)
  const handleFileChange = (event, weekKey, reportDate) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Bitte wähle eine PDF-Datei aus.");
        return;
      }
      setSelectedFile(file);
      setSelectedReportDate(new Date(reportDate));
      setSelectedWeekKey(weekKey);
      const fileUrl = URL.createObjectURL(file);
      setSelectedPdfUrl(fileUrl);
      setShowPreview(true);
    }
  };

  const handleConfirmUpload = async () => {
    setShowPreview(false);
    setUploading(true);
    try {
      const result = await uploadReport(token, selectedFile, selectedReportDate);
      let pdfUrl = null;
      const pdfData = result.data.attributes.pdf;
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
      setReports((prev) => ({ ...prev, [selectedWeekKey]: pdfUrl }));
    } catch (err) {
      console.error("Fehler beim Upload:", err);
      alert("Fehler beim Upload: " + err.message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setSelectedPdfUrl(null);
      setSelectedReportDate(null);
      setSelectedWeekKey(null);
    }
  };

  const handleCancelUpload = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setSelectedPdfUrl(null);
    setSelectedReportDate(null);
    setSelectedWeekKey(null);
  };

  // Wenn ein azubi-Prop übergeben wird, verwenden wir den Kalender-Modus,
  // d.h. statt Monatsnamen werden Zahlen 1 bis 12 angezeigt.
  const isCalendarMode = !!azubi;
  const monthLabels = isCalendarMode
    ? Array.from({ length: 12 }, (_, i) => (i + 1).toString())
    : [
        "September",
        "Oktober",
        "November",
        "Dezember",
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
      ];

  return (
    <div style={{ backgroundColor: "var(--color-base-100)", minHeight: "100vh" }}>
      <header style={{ backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "6xl", margin: "0 auto", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-text)" }}>
            Ausbildungsnachweise
          </h1>
          {/* Vorlage-Button nur anzeigen, wenn kein Azubi übergeben wurde */}
          {!azubi && (
            <button
              onClick={handleDownloadTemplate}
              style={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "box-shadow 0.3s",
                cursor: "pointer",
                height: "auto",
              }}
            >
              <span style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "0.25rem 0.5rem",
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}>
                DOCX
              </span>
              <span style={{
                backgroundColor: "#bfdbfe",
                color: "#1e40af",
                padding: "0.25rem 0.75rem",
                display: "flex",
                alignItems: "center",
                fontSize: "0.875rem",
              }}>
                Berichtsheft Vorlage
                <svg
                  style={{ width: 16, height: 16, marginLeft: 4 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 15V3" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </header>
      <main>
        <div style={{ maxWidth: "7xl", margin: "0 auto", padding: "1.5rem" }}>
          {loading && <div>Lade Berichtshefte...</div>}
          {error && <div style={{ color: "red" }}>Fehler: {error}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            {[1, 2, 3].map((year) => (
              <button
                key={year}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  flexGrow: 1,
                  margin: "0 0.25rem",
                  backgroundColor: selectedYear === year ? "var(--color-primary)" : "#e5e7eb",
                  color: selectedYear === year ? "#fff" : "#000",
                }}
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedMonth(0);
                }}
              >
                Jahr {year}
              </button>
            ))}
          </div>
          {/* Monat-Auswahl */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            {monthLabels.map((label, index) => (
              <button
                key={index}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  flexGrow: 1,
                  margin: "0 0.25rem",
                  backgroundColor: selectedMonth === index ? "var(--color-accent)" : "#e5e7eb",
                  color: selectedMonth === index ? "#fff" : "#000",
                }}
                onClick={() => setSelectedMonth(index)}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {Array.from({ length: 52 }, (_, i) => {
              const reportDate = calculateWeekDate(startDates[selectedYear - 1], i + 1);
              // Filtere Berichtshefte anhand des ausgewählten Monats:
              if (isCalendarMode) {
                if (getMonth(reportDate) !== selectedMonth) return null;
              } else {
                const academicMonthIndex = (getMonth(reportDate) + 4) % 12;
                if (academicMonthIndex !== selectedMonth) return null;
              }
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
                  fileInputRef={(el) => (fileInputRefs.current[weekKey] = el)}
                  onFileChange={(e) => handleFileChange(e, weekKey, reportDate)}
                  onPreviewClick={(url) => {
                    setSelectedPdfUrl(url);
                    setShowPreview(true);
                  }}
                  allowUpload={allowUpload}
                />
              );
            })}
          </div>
          {uploading && <div style={{ marginTop: "1rem", textAlign: "center" }}>Upload läuft...</div>}
        </div>
      </main>
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
