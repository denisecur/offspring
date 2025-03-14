// src/pages/Berichtshefte/Berichtshefte.jsx
import React, { useState, useRef, useEffect } from "react";
import { getMonth } from "date-fns";
import { getToken, getCurrentUser } from "../../helpers"; // Stelle sicher, dass getCurrentUser verfügbar ist!
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
  // Wenn kein azubi-Prop übergeben wird, verwende den aktuell angemeldeten Benutzer
  const currentAzubi = azubi || getCurrentUser();
  
  useEffect(() => {
    console.log("🔄 Berichtshefte neu gerendert mit Azubi:", currentAzubi);
  }, [currentAzubi]);
  
  console.log("Erhaltener Azubi in Berichtshefte:", currentAzubi);
  if (!currentAzubi) return <div>Lade Azubi-Daten...</div>;
  
  const token = getToken();
  getThemeColors(localStorage.getItem("theme") || "basicLight");

  // Vorlage (Download) laden
  const [vorlage, setVorlage] = useState(null);

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

  // Vorlage beim Mount laden
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

  // Vorlage-Vorschau öffnen
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
      setSelectedReportDate(new Date(reportDate)); // sicherstellen, dass es ein Date-Objekt ist
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
      setReports(prev => ({ ...prev, [selectedWeekKey]: pdfUrl }));
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

  const months = [
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
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-base-100)" }}>
      <header className="bg-white shadow-none">
        <div className="max-w-6xl pt-4 mx-auto px-9 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
            Ausbildungsnachweise
          </h1>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer h-auto"
          >
            <span className="bg-blue-600 text-white px-2 py-1 rounded-l-full text-sm font-bold">
              DOCX
            </span>
            <span className="bg-blue-200 text-blue-900 px-3 py-1 flex items-center text-sm">
              Berichtsheft Vorlage
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a2 2 0 0 0 2 2h12 a2 2 0 0 0 2-2v-1 M7 10l5 5 5-5 M12 15V3"
                />
              </svg>
            </span>
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading && <div>Lade Berichtshefte...</div>}
          {error && <div className="text-red-500">Fehler: {error}</div>}
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map(year => (
              <button
                key={year}
                className="py-2 px-4 rounded flex-grow mx-1"
                style={{
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
          <div className="flex justify-between mb-4">
            {months.map((month, index) => (
              <button
                key={month}
                className="py-2 px-4 rounded flex-grow mx-1"
                style={{
                  backgroundColor: selectedMonth === index ? "var(--color-accent)" : "#e5e7eb",
                  color: selectedMonth === index ? "#fff" : "#000",
                }}
                onClick={() => setSelectedMonth(index)}
              >
                {month}
              </button>
            ))}
          </div>
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
          {uploading && <div className="mt-4 text-center">Upload läuft...</div>}
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
