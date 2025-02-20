import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    Tooltip,
    ResponsiveContainer
  } from "recharts";
  
  const GradeRadarChart = ({ grades, faecher }) => {
    const calculateAverage = (subjectGrades) => {
      if (subjectGrades.length === 0) return 0;
      const sum = subjectGrades.reduce((acc, grade) =>
        acc + parseFloat(grade.wert) * parseFloat(grade.gewichtung), 0
      );
      const totalWeight = subjectGrades.reduce((acc, grade) =>
        acc + parseFloat(grade.gewichtung), 0
      );
      return sum / totalWeight; // z.B. 2.3
    };
  
    // Radar-Daten: Speichere sowohl originalAverage als auch score (invertiert)
    const data = faecher.map((fach) => {
      const subjectGrades = grades.filter(g => g.ausbildungsfach?.id === fach.id);
      const originalAverage = calculateAverage(subjectGrades); // z.B. 2.3
      const score = 7 - originalAverage; // 7 - 2.3 = 4.7, gute Note außen
      return {
        subject: fach.name,
        score,            // benutzt Recharts für die Position 
        originalAverage,  // zeigen wir im Tooltip
        fullMark: 6
      };
    });
  
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          {/* Domain = [1, 6], 1 innen, 6 außen; Score = 7 - Note => gute Note => größerer Score => außen */}
          <PolarRadiusAxis angle={30} domain={[1, 6]} />
          
          <Radar
            name="Durchschnitt"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          
          <Tooltip
            // formatter gibt uns (Wert, DatenKeyName, weitereProps) 
            // Wir holen den originalAverage aus payload
            formatter={(value, name, props) => {
              // name === "Durchschnitt", value === score (z.B. 4.7)
              // props.payload.originalAverage === 2.3
              const realAvg = props.payload.originalAverage.toFixed(2);
              return [realAvg, "Durchschnitt"]; 
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    );
  };
  
  export default GradeRadarChart;
  