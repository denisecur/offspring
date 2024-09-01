import React, { useEffect, useState } from 'react';
import { getFaecherByAusbildungsrichtung } from '../../api/noten/ausbildungsfaecherService';
import { CircularProgress } from "@mui/material";

const Fachliste = () => {
  const [faecher, setFaecher] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFaecher = async () => {
      setLoading(true);
      try {
        const response = await getFaecherByAusbildungsrichtung("Büromanagement");
        console.log("RESPONSE: ", response); // Log the response object
        setFaecher(response); // No .data needed here
      } catch (err) {
        setError("Fehler beim Abrufen der Fächer");
      } finally {
        setLoading(false);
      }
    };

    loadFaecher();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        faecher.map((fach) => (
          <div key={fach.id}>
            <span>ID: {fach.id}</span>
            <span>Name: {fach.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Fachliste;
