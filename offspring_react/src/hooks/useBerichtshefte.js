import { useState, useEffect } from "react";
import { fetchReports } from "../api_services/berichtshefte/berichtshefteService";
import { generateWeekKey } from "../utils/dateUtils";

export const useBerichtshefte = (token, azubi) => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAzubi, setCurrentAzubi] = useState(null);

  

  useEffect(() => {
    console.log("🔄 useBerichtshefte triggered! Aktueller Azubi:", azubi);
  
    if (!azubi || !azubi.id) {
      console.log("⏳ Warte auf gültigen Azubi...");
      return;
    }
  
    console.log("✅ useBerichtshefte: Azubi erhalten!", azubi);
  
    setReports({}); // Berichte zurücksetzen
    setLoading(true);
    setError(null);
  
    const loadReports = async () => {
      console.log("🔍 Lade Berichtshefte für:", azubi.id);
  
      try {
        const result = await fetchReports(token, azubi.id);
        console.log("📥 API-Antwort:", result);
  
        const fetchedReports = {};
        result.data.forEach((report) => {
          console.log("📄 Verarbeite Bericht:", report);
  
          if (report.owner && report.owner.id === azubi.id) {
            const reportDate = new Date(report.woche_vom);
            const weekKey = generateWeekKey(reportDate);
            let pdfUrl = report.pdf?.url ? `http://localhost:1337${report.pdf.url}` : null;
            fetchedReports[weekKey] = pdfUrl;
          }
        });
  
        console.log("✅ Gefilterte Berichte:", fetchedReports);
        setReports(fetchedReports);
      } catch (err) {
        console.error("❌ Fehler beim Laden der Berichtshefte:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadReports();
  }, [token, azubi?.id]); // 🔥 ACHTUNG: azubi?.id statt nur azubi!
  

  

  return { reports, loading, error, setReports, currentAzubi };
};