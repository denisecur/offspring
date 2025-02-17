import React, { useState, useRef, useEffect } from "react";
import { addWeeks, format, getMonth, getISOWeek, startOfWeek } from "date-fns";
import { getToken } from "../../helpers";
import getThemeColors from "../../config/theme";
import { fetchReports, uploadReport } from "../../api_services/berichtshefte/berichtshefteService";

const Berichtshefte = () => {
  const token = getToken();
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // Default: September
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Basisstartdaten (z. B. 1. September) – diese werden dann auf den Montag der entsprechenden Woche abgebildet
  const baseDates = [
    new Date(2023, 8, 1),
    new Date(2024, 8, 1),
    new Date(2025, 8, 1),
  ];
  const startDates = baseDates.map(date => startOfWeek(date, { weekStartsOn: 1 }));

  useEffect(() => {
    const themeName = localStorage.getItem("theme") || "basicLight";
    getThemeColors(themeName);
  }, []);

  // Generiert einen Key basierend auf der Kalenderwoche
  const generateWeekKey = (reportDate) => {
    const weekNumber = getISOWeek(reportDate);
    return `${weekNumber}`;
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

  const calculateWeekDate = (startDate, weekNumber) =>
    addWeeks(startDate, weekNumber - 1);

  const fileInputRefs = useRef({});

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchReports(token);
        const fetchedReports = {};
        result.data.forEach((report) => {
          const reportDate = new Date(report.woche_vom);
          const weekKey = generateWeekKey(reportDate);
          let pdfUrl = null;
          const pdfData = report.pdf;
          if (pdfData && pdfData.url) {
            pdfUrl = pdfData.url.startsWith("http")
              ? pdfData.url
              : `http://localhost:1337${pdfData.url}`;
          }
          fetchedReports[weekKey] = pdfUrl;
        });
        setReports(fetchedReports);
      } catch (err) {
        console.error("Fehler beim Laden der Berichtshefte:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [token]);

  const handleUploadClick = (weekKey) => {
    if (fileInputRefs.current[weekKey]) {
      fileInputRefs.current[weekKey].click();
    }
  };

  const uploadBerichtsheft = async (file, reportDate) => {
    setUploading(true);
    setUploadError(null);
    try {
      const result = await uploadReport(token, file, reportDate);
      let pdfUrl = null;
      try {
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
      } catch (e) {
        throw new Error("PDF-URL nicht gefunden");
      }
      return pdfUrl;
    } catch (err) {
      console.error("Fehler beim Upload des Berichtsheftes:", err);
      setUploadError(err.message);
      alert("Fehler beim Upload des Berichtsheftes: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event, weekKey, reportDate) => {
    const file = event.target.files[0];
    if (file) {
      const pdfUrl = await uploadBerichtsheft(file, reportDate);
      if (pdfUrl) {
        setReports((prevReports) => ({
          ...prevReports,
          [weekKey]: pdfUrl,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-base-100)" }}>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>Ausbildungsnachweise</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading && <div>Lade Berichtshefte...</div>}
          {error && <div className="text-red-500">Fehler: {error}</div>}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed rounded-lg p-6" style={{ borderColor: "var(--color-primary)" }}>
              <div className="flex justify-between mb-4 w-full">
                <div className="flex justify-between space-x-2 w-full">
                  {[1, 2, 3].map((year) => (
                    <button
                      key={year}
                      className="flex-grow py-2 px-4 rounded"
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
              </div>
              <div className="flex justify-between items-center mb-4 w-full">
                <div className="flex justify-between space-x-2 w-full">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      className="flex-grow py-2 px-4 rounded"
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
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 52 }, (_, i) => {
                  // Erstelle das Report-Datum aus dem berechneten Start-Datum (Montag) und der Wochenanzahl
                  const reportDate = calculateWeekDate(startDates[selectedYear - 1], i + 1);
                  const academicMonthIndex = (getMonth(reportDate) + 4) % 12;
                  const weekKey = generateWeekKey(reportDate);
                  const kw = getISOWeek(reportDate); // KW zur Anzeige

                  if (academicMonthIndex === selectedMonth) {
                    const handleFileInputChange = (e) => {
                      handleFileChange(e, weekKey, reportDate);
                    };

                    return (
                      <div
                        key={i}
                        className="bg-white p-4 shadow-md rounded-lg"
                        style={{ backgroundColor: "var(--color-neutral)", color: "var(--color-text)" }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-bold">{format(reportDate, "dd.MM.yyyy")}</div>
                          <button
                            onClick={() => handleUploadClick(weekKey)}
                            style={{
                              color: reports[weekKey] ? "grey" : "var(--color-error)",
                            }}
                            className="py-2 px-4 rounded hover:underline"
                          >
                            {reports[weekKey] ? "Update 🔄" : "Upload ⬆️"}
                          </button>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            ref={(el) => (fileInputRefs.current[weekKey] = el)}
                            onChange={handleFileInputChange}
                          />
                        </div>
                        {/* Anzeige der Kalenderwoche */}
                        <div className="mt-1 text-sm">KW: {kw}</div>
                        <div className="mt-2">
                          {reports[weekKey] ? (
                            <a href={reports[weekKey]} style={{ color: "var(--color-success)" }} className="hover:font-bold">
                              Vorschau
                            </a>
                          ) : (
                            <div className="text-gray-500">ausstehend</div>
                          )}
                        </div>
                        {uploading && (
                          <div className="text-sm text-blue-500">Upload läuft…</div>
                        )}
                        {uploadError && (
                          <div className="text-sm text-red-500">Upload-Fehler: {uploadError}</div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Berichtshefte;
