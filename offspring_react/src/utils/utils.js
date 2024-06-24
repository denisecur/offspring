// utils.js
export const calculateAverage = (noten) => {
    const totalWeight = noten.reduce((sum, note) => sum + note.gewichtung, 0);
    const weightedSum = noten.reduce((sum, note) => sum + note.wert * note.gewichtung, 0);
    return (weightedSum / totalWeight).toFixed(2);
  };
  
  export const calculateTrend = (noten) => {
    if (noten.length < 2) return null; // Ensure there are at least 2 grades to compare
  
    const notenWithoutLast = noten.slice(0, -1); // All grades except the last one
    const averageBefore = calculateAverage(notenWithoutLast); // Average before the last grade
    const averageAfter = calculateAverage(noten); // Average including the last grade
  
    if (averageAfter > averageBefore) return 'up';
    if (averageAfter < averageBefore) return 'down';
    return 'neutral';
  };
  