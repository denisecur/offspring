import React from 'react';
import FeatureCard from '../../components/FeatureCard';
import berichtshefte from  "../../assets/berichtshefte_card_icon.svg"
import noten from  "../../assets/noten_card_icon.svg"
import ausbildung from  "../../assets/ausbildung_card_icon.svg"

const Home = () => {
  return (
    <div className="container mx-auto p-4 object-center">

<h1 className="mb-4 text-lg font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-4xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Offspring.</span> Nachwuchs.</h1>
<p className="font-normal text-gray-500 lg:text-xl dark:text-gray-400">Verwalte deine schulischen Leistungen und Berichtshefte bequem an einem Ort, um stets den Überblick zu behalten. Deine Vorgesetzten haben Einsicht in deine Fortschritte und unterstützen dich dabei, stets auf dem richtigen Weg zu bleiben. So profitierst du von einer strukturierten und transparenten Dokumentation, die deinen Fortschritt unterstützt, um Deine Ausbildung bestmöglich zu meistern. </p>

      <div className="flex flex-wrap justify-center mt-10">
        <FeatureCard title="Berichtshefte" description="Erstellen und Verwalten Deiner wöchentlichen Ausbildungsnachweise" image={berichtshefte} scale={0.70} />
        <FeatureCard title="Noten" description="Schulnoten speichern und Deinen Notendurchschnitt anzeigen" image={noten} scale={0.8} />
        <FeatureCard title="Ausbildung" description="Informationen über Deine schulische und betriebliche Ausbildung" image={ausbildung} scale={0.8}  />
      </div>
    </div>
  );
};

export default Home;
