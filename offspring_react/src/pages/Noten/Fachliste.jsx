import {React, useEffect, useState} from 'react';
import { fetchAusbildungsfaecher } from '../../api/noten/ausbildungsfaecherService';
import { CircularProgress } from "@mui/material"; // Optional: To show a loading indicator

const Fachliste = () => {
    const [faecher, setFaecher] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState("");
    // Fetch Fächer
  useEffect(() => {
    const loadFaecher = async () => {
      setLoading(true);
      try {
        const response = await fetchAusbildungsfaecher();
        setFaecher(response.data);
        console.log(response.data);
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
          faecher.map((fach, id) => {
            // anders, nochmal genau anschauen, was ich wo bekomme und wie wozu verarbeite!
          })
        )}
    </div>
  );
};

export default Fachliste;
