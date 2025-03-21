import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Registrierung der ChartJS-Komponenten und Plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
  annotationPlugin
);

const GradeTableWithCharts = ({ grades }) => {
  // Datenvorbereitung: Noten nach Fach gruppieren
  const data = useMemo(() => {
    const fachMap = {};

    grades?.forEach((grade) => {
      const fachName = grade.ausbildungsfach ? grade.ausbildungsfach.name : 'Nicht zugeordnet';
      if (!fachMap[fachName]) {
        fachMap[fachName] = {
          fach: fachName,
          grades: [],
        };
      }
      fachMap[fachName].grades.push(grade);
    });

    // Umwandlung des fachMap in ein Array und Berechnung des Durchschnitts
    return Object.values(fachMap).map((fachData) => {
      const totalWeight = fachData.grades.reduce((sum, g) => sum + g.gewichtung, 0);
      const weightedSum = fachData.grades.reduce((sum, g) => sum + g.wert * g.gewichtung, 0);
      const averageGrade = totalWeight ? (weightedSum / totalWeight).toFixed(2) : '0.00';

      return {
        fach: fachData.fach,
        averageGrade,
        grades: fachData.grades,
      };
    });
  }, [grades]);

  // Definition der Spalten
  const columns = useMemo(
    () => [
      {
        accessorKey: 'fach',
        header: 'Fach',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'averageGrade',
        header: 'Durchschnittsnote',
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const value = parseFloat(cell.getValue());
          let colorClass = '';
          if (value < 2.50) colorClass = 'text-[var(--color-success)]';
          else if (value >= 4.20) colorClass = 'text-[var(--color-error)]';
          else colorClass = 'text-[var(--color-text)]';
          return <span className={`font-bold ${colorClass}`}>{value}</span>;
        },
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection={false}
      initialState={{ density: 'comfortable' }}
      renderDetailPanel={({ row }) => {
        const fachData = row.original;
        // Erstelle eine sortierte Kopie der Noten
        const sortedGrades = [...fachData.grades].sort(
          (a, b) => new Date(a.datum) - new Date(b.datum)
        );

        if (sortedGrades.length < 2) {
          return (
            <Box
              sx={{
                height: '237px',
                width: '90%',
                paddingLeft: '5%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2">Keine ausreichenden Daten vorhanden</Typography>
            </Box>
          );
        }

        const chartData = {
          labels: sortedGrades.map((grade) => grade.datum),
          datasets: [
            {
              label: 'Notenverlauf',
              data: sortedGrades.map((grade) => grade.wert),
              fill: false,
              borderColor: 'blue',
              backgroundColor: 'lightblue',
              tension: 0.1,
            },
            {
              label: 'Durchschnitt',
              data: sortedGrades.map(() => parseFloat(fachData.averageGrade)),
              borderColor: 'red',
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        };

        const chartOptions = {
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 1,
              max: 6,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },
          },
        };
        

        return (
          <div style={{ height: '237px', width: '90%', paddingLeft: '5%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        );
      }}
      muiTableBodyRowProps={{
        hover: true,
      }}
    />
  );
};

export default GradeTableWithCharts;
