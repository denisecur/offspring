import React from "react";
import FeatureCard from "../../components/FeatureCard";
import berichtshefte from "../../assets/berichtshefte_card_icon.svg";
import noten from "../../assets/noten_card_icon.svg";
import ausbildung from "../../assets/ausbildung_card_icon.svg";
import { useTheme } from "@mui/material/styles";
import offspring_gelb from "../../../public/text-1739362619826 (8).svg";

const AzubiDashboard = () => {
  const theme = useTheme();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 text-white"
      style={{ backgroundColor: theme.palette.background.default }}
    >
      
      {/* Beschreibung in einer Terminal-Box mit gelbem Neon-Rahmen */}
      <div
        className="mt-10 border-4 rounded-lg p-6  text-center shadow-lg"
        style={{
          borderColor: theme.palette.secondary,
          backgroundColor: theme.palette.neutral,
          boxShadow: "0px 0px 15px #05d9e8",
        }}
      >
        <p
          className="text-base md:text-base lg:text-xl leading-relaxed"
          style={{ color: theme.palette.secondary }}
        >
          Verwalte deine schulischen Leistungen und Berichtshefte bequem an einem
          Ort, um stets den Überblick zu behalten. Deine Vorgesetzten haben
          Einsicht in deine Fortschritte und unterstützen dich dabei, stets auf
          dem richtigen Weg zu bleiben.
        </p>
      </div>

      {/* Terminal-Rahmen für Feature Cards */}
      <div
        className="mt-10 border-4 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 shadow-lg"
        style={{
          borderColor: theme.palette.secondary,
          backgroundColor: theme.palette.neutral,
          boxShadow: "0px 0px 15px #05d9e8",
        }}
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
