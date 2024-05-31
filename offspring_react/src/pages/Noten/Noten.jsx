import React, { useEffect, useState } from 'react';
import FachCard from '../../components/FachCard';
import ListView from '../../components/ListView';
import { fetchAusbildungsfaecher } from './../../api/noten/ausbildungsfaecherService';
import { calculateDurchschnitt } from '../../api/noten/notenService';


const Noten = () => {
  const [faecher, setFaecher] = useState([]);
  const [selectedFach, setSelectedFach] = useState(null);
  const [durchschnittMap, setDurchschnittMap] = useState({});

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

  const handleCardClick = (fach) => {
    setSelectedFach(fach);
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
      <div className="flex">
        {renderFachCards('Büromanagement')}
      </div>
      <div className="flex">
        {renderFachCards('beide')}
      </div>
  
    </div>
  );
};

export default Noten;
