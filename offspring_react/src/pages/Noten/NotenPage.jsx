import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material'; // Optional: To show a loading indicator
import Fachliste from './Fachliste';
import { fetchAusbildungsfaecher } from '../../api/noten/ausbildungsfaecherService';
import {fetchUserGrades} from '../../api/noten/notenService';

const NotenPage = () => {
  const [faecher, setFaecher] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    datum: '',
    wert: '',
    art: '',
    gewichtung: '',
    ausbildungsfach: '',
    lernfeld: '',
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); 

  // Fetch Fächer
  useEffect(() => {
    const loadFaecher = async () => {
      setLoading(true);
      try {
        const response = await fetchAusbildungsfaecher();
        setFaecher(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Fehler beim Abrufen der Fächer');
      } finally {
        setLoading(false);
      }
    };
    loadFaecher();
  }, []);

  // Load user grades when component mounts
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGrades();
        setGrades(response.data);
      } catch (err) {
        setError('Fehler beim Abrufen der Noten');
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  // Add a new grade
  const handleAddGrade = async () => {
    try {
      const response = await addUserGrade(newGrade);
      setGrades((prevGrades) => [...prevGrades, response.data]); // Use functional state update
      setNewGrade({
        datum: '',
        wert: '',
        art: '',
        gewichtung: '',
        ausbildungsfach: '',
        lernfeld: '',
      });
      setError('');
    } catch (err) {
      setError('Fehler beim Hinzufügen der Note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Notenverwaltung</h1>
        </div>
      </header>
       {/* Anzeige der Notenliste */}
       <div className="grades-list">
        <h3>Alle Noten</h3>
        {grades.length === 0 ? (
          <p>Keine Noten vorhanden</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Note</th>
                <th>Art</th>
                <th>Gewichtung</th>
                <th>Fach</th>
                <th>Lernfeld</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.datum}</td>
                  <td>{grade.wert}</td>
                  <td>{grade.art}</td>
                  <td>{grade.gewichtung}</td>
                  <td>{grade.ausbildungsfach ? grade.ausbildungsfach.name : 'Unbekannt'}</td>
                  <td>{grade.lernfeld || 'Unbekannt'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      <main>
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Fachliste faecher={faecher} />
        )}
      </main>
    </div>
  );
};

export default NotenPage;
