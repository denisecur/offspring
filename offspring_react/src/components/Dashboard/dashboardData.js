import berichtshefte from '../../assets/berichtshefte_card_icon.svg';
import noten from '../../assets/noten_card_icon.svg';
import profile from '../../assets/dashboards/profile.svg';
import ranking from '../../assets/dashboards/ranking.svg';


const dashboardData = {
  title: 'Willkommen im Azubi-Dashboard',
  description: 'Verwalte deine schulischen Leistungen und Berichtshefte bequem an einem Ort, um stets den Überblick zu behalten. Deine Vorgesetzten haben Einsicht in deine Fortschritte und unterstützen dich dabei, stets auf dem richtigen Weg zu bleiben.',
  features: [
    {
      title: 'Berichtshefte',
      description: 'Erstellen und Verwalten deiner wöchentlichen Ausbildungsnachweise',
      image: berichtshefte,
      scale: 0.8,
    },
    {
      title: 'Noten',
      description: 'Schulnoten speichern und deinen Notendurchschnitt anzeigen',
      image: noten,
      scale: 0.8,
    }
  ],
  chefTitle: 'Willkommen im Chef-Dashboard',
  chefDescription: 'Behalten Sie den Überblick über den Fortschritt Ihrer Auszubildenden. Sehen Sie Noten und Berichtshefte.',
  chefFeatures: [
    {
      title: 'Profile',
      description: 'Überprüfen Sie Noten und Berichtshefte der Azubis',
      featureList: ["<li>Durchschnitte nach Fach", "<li>radar chart für bla usw"
      ],
      image: profile,
      scale: 0.8,
    },
    {
      title: 'Ranking',
      description: 'Vergleichen Sie einzelne oder mehrere Azubis miteinander anhand von Ranglisten und Analysen.',
      image: ranking,
      scale: 0.8,
    }
  ],
};

export default dashboardData;