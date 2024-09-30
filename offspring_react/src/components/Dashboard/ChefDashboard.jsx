// ChefDashboard.jsx
import React, { useEffect, useState } from 'react';
import { SplitScreen } from '../Layout/SplitScreen';
import AzubiListe from '../AzubiListe';
import AzubiMonitor from './AzubiMonitor';
import { fetchAzubis } from '../../api/azubis/azubiService';

const ChefDashboard = () => {
  const [azubis, setAzubis] = useState([]);
  const [selectedAzubi, setSelectedAzubi] = useState(null); // Für die Hauptanzeige


  useEffect(() => {
    const loadAzubis = async () => {
      try {
        const response = await fetchAzubis();
        setAzubis(response);
      } catch (error) {
        console.error('Fehler beim Laden der Azubis:', error);
      }
    };

    loadAzubis();
  }, []);

  return (
    <SplitScreen leftWeight={1} rightWeight={3}>
      <AzubiListe azubis={azubis} onSelectAzubi={setSelectedAzubi} />
      <AzubiMonitor azubi={selectedAzubi} />
    </SplitScreen>
  );
};

export default ChefDashboard;
