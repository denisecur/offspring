import React from "react";
import FeatureCard from "../../components/FeatureCard";
import berichtshefte from "../../assets/berichtshefte_card_icon.svg";
import noten from "../../assets/noten_card_icon.svg";
import ausbildung from "../../assets/ausbildung_card_icon.svg";

const AzubiDashboard = () => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-base-100)" }}>      <div
        className="m-3 border-4 rounded-lg p-6 text-center shadow-[0_0_15px_#05d9e8] border-[var(--color-secondary)] bg-[var(--color-neutral)]"
      >
        <p className="text-base md:text-base lg:text-xl leading-relaxed text-[var(--color-secondary)]">
          Verwalte deine schulischen Leistungen und Berichtshefte bequem an einem
          Ort, um stets den Überblick zu behalten. Deine Vorgesetzten haben
          Einsicht in deine Fortschritte und unterstützen dich dabei, stets auf
          dem richtigen Weg zu bleiben.
        </p>
      </div>
      <div>
      </div>

      {/* "Terminal"-Rahmen für Feature Cards */}
      <div
        className="mt-10 m-3 border-4 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 shadow-[0_0_15px_#05d9e8] border-[var(--color-secondary)] bg-[var(--color-neutral)]"
      > 
        <FeatureCard
          title="Berichtshefte"
          description="Erstellen und Verwalten deiner wöchentlichen Ausbildungsnachweise"
          image={berichtshefte}
          scale={0.7}
        />
        <FeatureCard
          title="Noten"
          description="Schulnoten speichern und deinen Notendurchschnitt anzeigen"
          image={noten}
          scale={0.8}
        />
        <FeatureCard
          title="Ausbildung"
          description="Informationen über deine schulische und betriebliche Ausbildung"
          image={ausbildung}
          scale={0.8}
        />
      </div>
      </div>
  );
};

export default AzubiDashboard;
