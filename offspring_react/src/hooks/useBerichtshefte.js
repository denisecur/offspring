// src/hooks/useBerichtshefte.js
import { useState, useEffect } from "react";
import { fetchReports } from "../api_services/berichtshefte/berichtshefteService";
import { generateWeekKey } from "../utils/dateUtils";

export const useBerichtshefte = (token) => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [token]);

  return { reports, loading, error, setReports };
};
