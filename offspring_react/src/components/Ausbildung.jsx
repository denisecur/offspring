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
      console.log("data = ", data.data);
      const ausbildungsfaecherData = data?.data?.map((item) => ({
        id: item.id,
        name: item.attributes.name,
        fachrichtung: item.attributes.fachrichtung,
      }));
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
