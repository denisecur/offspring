import React, { useEffect, useState } from "react";
import { fetchLernfelder } from "./../api/noten/lernfelderService";
import { fetchAusbildungsfaecher } from "./../api/noten/ausbildungsfaecherService";
import FaecherList from "./FaecherList";
import LernfelderList from "./LernfelderList";

const Ausbildung = () => {
  const [faecher, setFaecher] = useState([]);
  const [lernfelder, setLernfelder] = useState([]);

  useEffect(() => {
  const loadAusbildungsfaecher = async () => {
    const data = await fetchAusbildungsfaecher();
    const ausbildungsfaecherData = data?.data?.map((item) => {
      // Extrahiere die Lernfelder, falls vorhanden
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
    console.log((ausbildungsfaecherData))
    setFaecher(ausbildungsfaecherData);
  };

  loadAusbildungsfaecher();
}, []);

  useEffect(() => {
    const loadLernfelder = async () => {
      const data = await fetchLernfelder();
      console.log("data = ", data);
      const lernfelderData = data?.map((item) => ({
        id: item.id,
        name: item.attributes.name,
        ausbildungsfachName: item.attributes.ausbildungsfach?.data?.attributes?.name,
      }));
      setLernfelder(lernfelderData);
      console.log(lernfelderData)
    };
    loadLernfelder();
  }, []);

  return (
    <div>
      <FaecherList faecher={faecher} />
      <LernfelderList lernfelder={lernfelder} />
    </div>
  );
};

export default Ausbildung;
