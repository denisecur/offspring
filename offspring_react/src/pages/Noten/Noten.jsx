import React, { useEffect, useState } from 'react';
import FachCard from '../../components/FachCard';
import ListView from '../../components/ListView';
import { fetchAusbildungsfaecher } from '../../api/noten/ausbildungsfaecherService';
import { calculateDurchschnitt, fetchUserGrades } from '../../api/noten/notenService';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const Noten = () => {
  const [faecher, setFaecher] = useState([]);
  const [selectedFach, setSelectedFach] = useState(null);
  const [durchschnittMap, setDurchschnittMap] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [filteredGrades, setFilteredGrades] = useState([]);

  useEffect(() => {
    const loadAusbildungsfaecher = async () => {
      const data = await fetchAusbildungsfaecher();
      const ausbildungsfaecherData = data.data.map((item) => {
        const lernfelder = Array.isArray(item.attributes.lernfelder.data) && item.attributes.lernfelder.data.length > 0
          ? item.attributes.lernfelder.data.map(lernfeld => ({
              id: lernfeld.id,
              name: lernfeld.attributes.name
            }))
          : [];

        return {
          id: item.id,
          name: item.attributes.name,
          fachrichtung: item.attributes.fachrichtung,
          lernfelder_count: lernfelder.length,
          lernfelder: lernfelder
        };
      });
      setFaecher(ausbildungsfaecherData);
    };

    loadAusbildungsfaecher();
  }, []);

  useEffect(() => {
    const loadDurchschnitt = async () => {
      const newDurchschnittMap = {};
      for (const fach of faecher) {
        const durchschnitt = await calculateDurchschnitt(fach.id);
        newDurchschnittMap[fach.id] = durchschnitt;
      }
      setDurchschnittMap(newDurchschnittMap);
    };

    if (faecher.length > 0) {
      loadDurchschnitt();
    }
  }, [faecher]);

  useEffect(() => {
    const loadFilteredGrades = async () => {
      try {
        const data = await fetchUserGrades();
        const gradesData = data?.ausbildung?.noten?.map(note => ({
          id: note.id,
          datum: new Date(note.datum),
          wert: note.wert,
          art: note.art,
          gewichtung: note.gewichtung,
          ausbildungsfach: note.ausbildungsfach?.name,
          lernfeld: note.lernfeld?.id,
        })) || [];

        if (dateRange[0] && dateRange[1]) {
          const [start, end] = dateRange;
          const filtered = gradesData.filter(grade => grade.datum >= start && grade.datum <= end);
          setFilteredGrades(filtered);
        } else {
          setFilteredGrades(gradesData);
        }
      } catch (error) {
        message.error('Fehler beim Abrufen der Noten');
      }
    };

    loadFilteredGrades();
  }, [dateRange]);

  const handleCardClick = (fach) => {
    setSelectedFach(fach);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const renderFachCards = (filter) => {
    return faecher
      .filter(fach => fach.fachrichtung === filter)
      .map(fach => (
        <FachCard 
          key={fach.id} 
          fach={fach.name} 
          durchschnitt={durchschnittMap[fach.id] || 'Laden...'} 
          fachrichtung={fach.fachrichtung}
          onClick={() => handleCardClick(fach)} 
        />
      ));
  };

  return (
    <div>
      <RangePicker onChange={handleDateRangeChange} style={{ marginBottom: '1rem' }} />
      <div className="flex">
        {renderFachCards('Büromanagement')}
      </div>
      <div className="flex">
        {renderFachCards('beide')}
      </div>
      {selectedFach && (
        <ListView selectedFach={selectedFach} filteredGrades={filteredGrades} />
      )}
    </div>
  );
};

export default Noten;
