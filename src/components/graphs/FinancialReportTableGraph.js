// src/components/graphs/FinancialReportTableGraph.js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from './FinancialReportTableGraph.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialReportTableGraph({ chartData }) {
  return (
    <div className={styles.chartContainer}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  return value.toLocaleString();
                },
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}
