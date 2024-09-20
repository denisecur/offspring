// Funktion zur Berechnung des Schuljahres basierend auf einem Datum
export const getSchoolYear = (datum) => {
    const date = new Date(datum);
    const year = date.getFullYear();
    const month = date.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };
  
  // Funktion zur Berechnung des gewichteten Durchschnitts einer Notenliste
  export const calculateAverage = (grades) => {
    if (grades.length === 0) return "N/A";
    const totalWeightedSum = grades.reduce((sum, grade) => sum + grade.wert * grade.gewichtung, 0);
    const totalWeight = grades.reduce((sum, grade) => sum + grade.gewichtung, 0);
    return (totalWeightedSum / totalWeight).toFixed(2);
  };
  
  // Durchschnitt berechnen nach Fach
  export const calculateAverageByFach = (grades, fachName) => {
    const filteredGrades = grades.filter(grade => grade.ausbildungsfach.name === fachName);
    return calculateAverage(filteredGrades);
  };
  
  // Durchschnitt berechnen nach Schuljahr
  export const calculateAverageBySchuljahr = (grades, schuljahr) => {
    const filteredGrades = grades.filter(grade => getSchoolYear(grade.datum) === schuljahr);
    return calculateAverage(filteredGrades);
  };
  
  // Durchschnitt berechnen nach Fach und Schuljahr
  export const calculateAverageByFachAndSchuljahr = (grades, fachName, schuljahr) => {
    const filteredGrades = grades.filter(grade => 
      grade.ausbildungsfach.name === fachName && getSchoolYear(grade.datum) === schuljahr
    );
    return calculateAverage(filteredGrades);
  };
  
  // Durchschnitt nach Schuljahr und Art der Leistungsnachweise
  export const calculateAverageBySchuljahrAndArt = (grades, schuljahr, art) => {
    const filteredGrades = grades.filter(grade => 
      getSchoolYear(grade.datum) === schuljahr && grade.art === art
    );
    return calculateAverage(filteredGrades);
  };
  
  // Durchschnitt nach Fach, Schuljahr und Art der Leistungsnachweise
  export const calculateAverageByFachSchuljahrAndArt = (grades, fachName, schuljahr, art) => {
    const filteredGrades = grades.filter(grade => 
      grade.ausbildungsfach.name === fachName &&
      getSchoolYear(grade.datum) === schuljahr &&
      grade.art === art
    );
    return calculateAverage(filteredGrades);
  };
  