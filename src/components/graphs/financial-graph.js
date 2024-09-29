import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { salesData } from "./graphData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Line과 Bar 차트를 모두 사용하기 위해 필요한 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialGraph() {
  // 차트 유형을 상태로 관리 (초기값은 'Bar')
  const [chartType, setChartType] = useState("Bar");

  // 차트 유형을 변경하는 함수
  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  // 렌더링할 차트를 선택
  const ChartComponent = chartType === "Bar" ? Bar : Line;

  return (
    <div>
      <h2>매출액 및 영업이익 추이</h2>
      <button onClick={toggleChartType}>
        {chartType === "Bar" ? "Line 차트로 보기" : "Bar 차트로 보기"}
      </button>
      <ChartComponent
        data={salesData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `기간별 매출액 및 영업이익 (${chartType} 차트)`,
            },
          },
        }}
      />
    </div>
  );
}
