import React from "react";

const GradeTable = ({ grades, filter, faecher }) => {
  // Aktive Filter sammeln
  const activeFilters = [];

  // Fachname ermitteln
  const selectedFach = faecher.find((fach) => fach.id === parseInt(filter.fach));

  if (filter.fach && selectedFach) {
    activeFilters.push(`Fach: ${selectedFach.name}`);
  }

  if (filter.art) {
    activeFilters.push(`Art: ${filter.art}`);
  }

  if (filter.jahr) {
    activeFilters.push(`Schuljahr: ${filter.jahr}`);
  }

  // **Definition von showFachColumn**
  const showFachColumn = !filter.fach; // Zeigt die Spalte "Fach" nur an, wenn kein Fach gefiltert ist

  return (
    <div className="overflow-x-auto">
      {/* Aktive Filter anzeigen */}
      {activeFilters.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Aktive Filter:</span>{" "}
          {activeFilters.join(", ")}
        </div>
      )}

      {/* Tabelle */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showFachColumn && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fach
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Art
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gewichtung
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grades.map((grade) => (
            <tr key={grade.id}>
              {showFachColumn && (
                <td className="px-6 py-2 whitespace-nowrap">
                  {grade.ausbildungsfach
                    ? grade.ausbildungsfach.name
                    : "Nicht zugeordnet"}
                </td>
              )}
              <td className="px-6 py-2 whitespace-nowrap">{grade.wert}</td>
              <td className="px-6 py-2 whitespace-nowrap">{grade.art}</td>
              <td className="px-6 py-2 whitespace-nowrap">{grade.datum}</td>
              <td className="px-6 py-2 whitespace-nowrap">
                {grade.gewichtung}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeTable;
