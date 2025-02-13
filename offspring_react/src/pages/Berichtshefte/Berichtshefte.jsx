import React, { useState, useRef, useEffect } from 'react';
import { addWeeks, format, getMonth } from 'date-fns';
import { getToken } from '../../helpers';
import 'tailwindcss/tailwind.css';


const WeeklyReports = () => {
  const token = getToken();

  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // Default to September
  const [reports, setReports] = useState({}); // Mock data for reports

  const startDates = [
    new Date(2023, 8, 1), // Jahr 1 Startdatum (1. September 2023)
    new Date(2024, 8, 1), // Jahr 2 Startdatum (1. September 2024)
    new Date(2025, 8, 1), // Jahr 3 Startdatum (1. September 2025)
  ];
  
  const getYearNumber = (date) => {
    for (let i = 0; i < startDates.length; i++) {
      const startDate = startDates[i];
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      if (date >= startDate && date < endDate) {
        return i + 1;
      }
    }
    return null;
  };
  
  const getWeekNumber = (date, yearNumber) => {
    const startDate = startDates[yearNumber - 1];
    const diffInMs = date - startDate;
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    return Math.floor(diffInMs / oneWeekInMs) + 1;
  };
  

  const months = [
    'September', 'Oktober', 'November', 'Dezember',
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August'
  ];

  const calculateWeekDate = (startDate, weekNumber) => addWeeks(startDate, weekNumber - 1);

  // Refs für Datei-Inputs
  const fileInputRefs = useRef({});
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/berichtshefte', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Berichtshefte');
        }
  
        const result = await response.json();
        console.log('Result:', result);
  
        const fetchedReports = {};
        result.data.forEach((report) => {
          console.log('Report:', report);
          const reportDate = new Date(report.woche_vom);
          const weekKey = generateWeekKey(reportDate);
  
          // Extrahieren der PDF-URL
          let pdfUrl = null;
          const pdfData = report.pdf;
  
          if (pdfData && pdfData.url) {
            pdfUrl = pdfData.url.startsWith('http')
              ? pdfData.url
              : `http://localhost:1337${pdfData.url}`;
          }
  
          fetchedReports[weekKey] = pdfUrl;
        });
  
        setReports(fetchedReports);
      } catch (error) {
        console.error('Fehler beim Laden der Berichtshefte:', error);
      }
    };
  
    fetchReports();
  }, [token]);
  

  const generateWeekKey = (reportDate) => {
    const yearNumber = getYearNumber(reportDate);
    const weekNumber = getWeekNumber(reportDate, yearNumber);
    return `year${yearNumber}-week${weekNumber}`;
  };
  
  const handleUploadClick = (weekKey) => {
    if (fileInputRefs.current[weekKey]) {
      fileInputRefs.current[weekKey].click();
    }
  };
  

  const uploadBerichtsheft = async (file, reportDate) => {
    console.log('uploadBerichtsheft - reportDate:', reportDate);
    try {
      const formData = new FormData();
      const wocheVom = format(reportDate, 'yyyy-MM-dd');
      console.log('woche_vom:', wocheVom);
      formData.append('data', JSON.stringify({
        woche_vom: wocheVom,
      }));
      formData.append('files.pdf', file);
  
      const response = await fetch('http://localhost:1337/api/berichtshefte', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error(errorData.error.message || 'Upload fehlgeschlagen');
      }
  
      const result = await response.json();
      console.log('Upload erfolgreich:', result);
  
      // PDF-URL extrahieren
      let pdfUrl = null;
  
      try {
        const pdfData = result.data.attributes.pdf;
  
        if (pdfData && pdfData.data) {
          // Prüfe, ob pdf.data ein Array oder ein Objekt ist
          if (Array.isArray(pdfData.data)) {
            // Falls es ein Array ist
            if (pdfData.data.length > 0) {
              pdfUrl = pdfData.data[0].attributes.url;
            }
          } else {
            // Falls es ein Objekt ist
            pdfUrl = pdfData.data.attributes.url;
          }
        }
  
        if (!pdfUrl) {
          throw new Error('PDF-URL nicht gefunden');
        }
  
        // Basis-URL hinzufügen, falls erforderlich
        if (!pdfUrl.startsWith('http')) {
          pdfUrl = `http://localhost:1337${pdfUrl}`;
        }
      } catch (e) {
        console.error('Konnte die PDF-URL nicht extrahieren:', e);
        throw new Error('PDF-URL nicht gefunden');
      }
  
      return pdfUrl;
    } catch (error) {
      console.error('Fehler beim Upload des Berichtsheftes:', error);
      alert('Fehler beim Upload des Berichtsheftes: ' + error.message);
    }
  };
  


  const handleFileChange = async (event, weekKey, reportDate) => {
    console.log('handleFileChange - weekKey:', weekKey, 'reportDate:', reportDate);
  
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
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Ausbildungsnachweise</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg">
              <div className="flex justify-between mb-4 w-full">
                <div className="flex justify-between space-x-2 w-full">
                  {[1, 2, 3].map((year) => (
                    <button
                      key={year}
                      className={`flex-grow py-2 px-4 rounded ${
                        selectedYear === year
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedYear(year);
                        setSelectedMonth(0); // Reset to September
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
                      className={`flex-grow py-2 px-4 rounded ${
                        selectedMonth === index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() => setSelectedMonth(index)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 52 }, (_, i) => {
          const reportDate = calculateWeekDate(startDates[selectedYear - 1], i + 1);
          const academicMonthIndex = (getMonth(reportDate) + 4) % 12;
          const weekKey = `year${selectedYear}-week${i + 1}`;

          if (academicMonthIndex === selectedMonth) {
            // Hilfsfunktion definieren
            const handleFileInputChange = (e) => {
              handleFileChange(e, weekKey, reportDate);
            };

            return (
              <div key={i} className="bg-white p-4 shadow-md rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="font-bold">
                    {format(reportDate, 'dd.MM.yyyy')}
                  </div>
                  <button
                    onClick={() => handleUploadClick(weekKey)}
                    className="text-blue-500 hover:underline"
                  >
                    {reports[weekKey] ? 'Update' : 'Upload'}
                  </button>
                  <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    ref={(el) => (fileInputRefs.current[weekKey] = el)}
                    onChange={handleFileInputChange}
                  />
                </div>
                <div className="mt-2">
                  {reports[weekKey] ? (
                    <a
                      href={reports[weekKey]}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    <div className="text-gray-500">ausstehend</div>
                  )}
                </div>
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

export default WeeklyReports;
