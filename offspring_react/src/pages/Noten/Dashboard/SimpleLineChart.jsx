import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const uData = [2.1, 1.8, 2.39, 2.0, 3.19, 2.19, 3.19];
const pData = [2, 1.4, 2.9, 1.6, 4, 1.3, 4];
const xLabels = [
  'Mathematik',
  'Deutsch',
  'Englisch',
  'Bürot',
  'Kommunikation',
  'Page F',
  'Page G',
];

export default function SimpleLineChart() {
  return (
    <LineChart
      width={500}
      height={300}
      series={[
        { data: pData, label: 'pv' },
        { data: uData, label: 'uv' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    />
  );
}
