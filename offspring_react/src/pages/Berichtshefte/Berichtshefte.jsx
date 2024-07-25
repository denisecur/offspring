// src/components/WeeklyReports.jsx
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { addWeeks, format, getMonth } from 'date-fns';

const WeeklyReports = () => {
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // Default to September
  const [reports, setReports] = useState({}); // Mock data for reports

  const startDates = [
    new Date(2023, 8, 1), // Year 1 start date (Sept 1, 2023)
    new Date(2024, 8, 1), // Year 2 start date (Sept 1, 2024)
    new Date(2025, 8, 1), // Year 3 start date (Sept 1, 2025)
  ];

  const months = [
    'September', 'Oktober', 'November', 'Dezember',
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August'
  ];

  const calculateWeekDate = (startDate, weekNumber) => addWeeks(startDate, weekNumber - 1);

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
                  if (academicMonthIndex === selectedMonth) {
                    return (
                      <div key={i} className="bg-white p-4 shadow-md rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="font-bold">
                            {format(reportDate, 'dd.MM.yyyy')}
                          </div>
                          <button
                            onClick={() => console.log(`Upload for week ${i + 1}`)}
                            className="text-blue-500 hover:underline"
                          >
                            Upload
                          </button>
                        </div>
                        <div className="mt-2">
                          {reports[`year${selectedYear}-week${i + 1}`] ? (
                            <a
                              href={reports[`year${selectedYear}-week${i + 1}`]}
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
