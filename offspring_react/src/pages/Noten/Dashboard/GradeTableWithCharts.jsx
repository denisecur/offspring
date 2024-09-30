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

    // Umwandlung des fachMap in ein Array
    return Object.values(fachMap).map((fachData) => {
      const totalWeight = fachData.grades.reduce((sum, g) => sum + g.gewichtung, 0);
      const weightedSum = fachData.grades.reduce((sum, g) => sum + g.wert * g.gewichtung, 0);
      const averageGrade = (weightedSum / totalWeight).toFixed(2);
      const latestGrade = fachData.grades
        .sort((a, b) => new Date(b.datum) - new Date(a.datum))[0]
        .wert.toFixed(2);

      return {
        fach: fachData.fach,
        averageGrade,
        latestGrade,
        numberOfGrades: fachData.grades.length,
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
          let color = 'inherit';
          if (value <= 1.5) color = 'green';
          else if (value >= 4) color = 'red';
          return <span style={{ color, fontWeight: 'bold' }}>{value}</span>;
        },
      },
      {
        accessorKey: 'latestGrade',
        header: 'Letzte Note',
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const value = parseFloat(cell.getValue());
          let color = 'inherit';
          if (value <= 1.5) color = 'green';
          else if (value >= 4) color = 'red';
          return <span style={{ color }}>{value}</span>;
        },
      },
      {
        accessorKey: 'numberOfGrades',
        header: 'Anzahl Noten',
        enableColumnFilter: false,
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
        const fachGrades = fachData.grades;

        // Sortierung der Noten nach Datum
        fachGrades.sort((a, b) => new Date(a.datum) - new Date(b.datum));

        const chartData = {
          labels: fachGrades.map((grade) => grade.datum),
          datasets: [
            {
              label: 'Notenverlauf',
              data: fachGrades.map((grade) => grade.wert),
              fill: false,
              borderColor: 'blue',
              backgroundColor: 'lightblue',
              tension: 0.1,
            },
            {
              label: 'Durchschnitt',
              data: fachGrades.map(() => parseFloat(fachData.averageGrade)),
              borderColor: 'red',
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        };

        const chartOptions = {
          maintainAspectRatio: false, // Damit wir die Größe anpassen können
          scales: {
            y: {
              beginAtZero: true,
              reverse: true, // Bei Noten macht es Sinn, die Skala umzukehren (1 ist besser als 6)
              ticks: {
                stepSize: 1,
                min: 1,
                max: 6,
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
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6">Notenverlauf für {fachData.fach}</Typography>
            <div style={{ height: '300px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Box>
        );
      }}
      muiTableBodyRowProps={{
        hover: true,
      }}
    />
  );
};

export default GradeTableWithCharts;
