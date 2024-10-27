import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 구성 요소 등록
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const HoldingsProportionChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: '005380',
        data: data.map(item => parseFloat(item['005380'])),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: '000660',
        data: data.map(item => parseFloat(item['000660'])),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: '041510',
        data: data.map(item => parseFloat(item['041510'])),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return <Bar data={chartData} options={{ responsive: true }} />;
};

export default HoldingsProportionChart;
