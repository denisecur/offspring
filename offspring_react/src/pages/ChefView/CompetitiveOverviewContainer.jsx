// src/pages/Noten/Dashboard/CompetitiveOverviewContainer.jsx
import React, { useEffect, useState } from "react";
import { fetchUserGrades } from "../../../api_services/noten/notenService";
import { fetchAusbildungsDetails } from "../../../api_services/noten/ausbildungsfaecherService";
import CompetitiveOverview from "./CompetitiveOverview";

const CompetitiveOverviewContainer = () => {
  const [allGrades, setAllGrades] = useState([]);
  const [faecher, setFaecher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Alle Noten laden
        const gradesResponse = await fetchUserGrades();
        // Aufbereitung der verschachtelten Notendaten
        const loadedGrades = gradesResponse.data.map((item) => {
          const attr = item.attributes || {};
          const ownerData = attr.owner?.data;
          const ownerAttrs = ownerData?.attributes || {};
          return {
            id: item.id,
            value: attr.wert,
            datum: attr.datum,
            owner: ownerData
              ? {
                  id: ownerData.id,
                  username: ownerAttrs.username,
                  fachrichtung: ownerAttrs.fachrichtung,
                }
              : null,
          };
        });
        setAllGrades(loadedGrades);

        // Ausbildungsdetails laden (alle Richtungen)
        const details = await fetchAusbildungsDetails();
        setFaecher(details.faecher);
      } catch (err) {
        console.error(err);
        setError(err.message || "Fehler beim Laden");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return <CompetitiveOverview allGrades={allGrades} faecher={faecher} />;
};

export default CompetitiveOverviewContainer;
