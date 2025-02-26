import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getSchoolYear, calculateAverage } from "../../api_services/noten/calculations";
import Rahmen1 from "../Rahmen1";
const LineGraph = ({ grades }) => {
  if (!grades || grades.length === 0) {
    return <div>Keine Daten vorhanden</div>;
  }

  // Gruppiere die Noten nach Schuljahr
  const groupedGrades = grades.reduce((acc, grade) => {
    const schoolYear = getSchoolYear(grade.datum);
    if (!acc[schoolYear]) {
      acc[schoolYear] = [];
    }
    acc[schoolYear].push(grade);
    return acc;
  }, {});

  // Erstelle ein Array, das pro Schuljahr den gewichteten Durchschnitt enthält
  const data = Object.entries(groupedGrades).map(([schoolYear, gradeArray]) => {
    const avgStr = calculateAverage(gradeArray);
    const avg = avgStr === "N/A" ? 0 : parseFloat(avgStr);
    // Statt "2022/2023" nur den Start-Jahranteil (z. B. "2022") verwenden
    const startYear = schoolYear.split("/")[0];
    return { schoolYear: startYear, jahresdurchschnitt: avg };
  });

  // Sortiere die Daten chronologisch anhand des Startjahres
  data.sort((a, b) => parseInt(a.schoolYear) - parseInt(b.schoolYear));

  return (
    
    <div style={{ width: "100%", height: 150 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 40, left: -30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="schoolYear" />
          <YAxis domain={[0, 6]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="jahresdurchschnitt" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
