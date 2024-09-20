import React from "react";

const FilterComponent = ({ faecher, leistungsnachweise, schoolYears, filter, setFilter }) => {
  // Funktion zum Zurücksetzen der Filter
  const resetFilters = () => {
    setFilter({ jahr: "", fach: "", art: "" });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        {/* Filterfelder */}
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Filter nach Schuljahr */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Schuljahr:</label>
            <select
              className={`mt-1 block w-full py-2 px-3 border ${
                filter.jahr ? "bg-yellow-100" : "bg-white"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={filter.jahr}
              onChange={(e) => setFilter({ ...filter, jahr: e.target.value })}
            >
              <option value="">Alle Schuljahre</option>
              {schoolYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter nach Fach */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fach:</label>
            <select
              className={`mt-1 block w-full py-2 px-3 border ${
                filter.fach ? "bg-yellow-100" : "bg-white"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={filter.fach}
              onChange={(e) => setFilter({ ...filter, fach: e.target.value })}
            >
              <option value="">Alle Fächer</option>
              {faecher.map((fach) => (
                <option key={fach.id} value={fach.id}>
                  {fach.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter nach Art des Leistungsnachweises */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Art des Leistungsnachweises:</label>
            <select
              className={`mt-1 block w-full py-2 px-3 border ${
                filter.art ? "bg-yellow-100" : "bg-white"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={filter.art}
              onChange={(e) => setFilter({ ...filter, art: e.target.value })}
            >
              <option value="">Alle Arten</option>
              {leistungsnachweise.map((ln) => (
                <option key={ln.id} value={ln.art}>
                  {ln.art}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Button zum Zurücksetzen der Filter */}
        <button
          onClick={resetFilters}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Filter zurücksetzen
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
