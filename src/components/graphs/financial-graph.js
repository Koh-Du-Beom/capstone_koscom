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
import GraphLayout from "./GraphLayout"; // 이름 변경된 컴포넌트

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

  // 차트 컴포넌트 선택
  const ChartComponent = chartType === "Bar" ? Bar : Line;

  // 매출액, 영업이익 등 각 지표에 대해 두 회사의 데이터를 한 그래프에 겹쳐서 표시
  const graphs = [
    {
      label: "매출액",
      datasets: salesData.datasets.filter(dataset => dataset.label.includes("매출액")),
    },
    {
      label: "영업이익",
      datasets: salesData.datasets.filter(dataset => dataset.label.includes("영업이익")),
    },
    {
      label: "순매출",
      datasets: salesData.datasets.filter(dataset => dataset.label.includes("순매출")),
    }
  ].map((graphData, index) => {
    const data = {
      labels: salesData.labels,
      datasets: graphData.datasets,
    };

    return (
      <div key={index}>
        <h2>{graphData.label}</h2>
        <ChartComponent
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `${graphData.label} (${chartType} 차트)`,
              },
            },
          }}
        />
      </div>
    );
  });

  return (
    <div>
      <button onClick={toggleChartType}>
        {chartType === "Bar" ? "Line 차트로 보기" : "Bar 차트로 보기"}
      </button>

      {/* 여러 그래프를 GraphLayout으로 배치 */}
      <GraphLayout graphs={graphs} />
    </div>
  );
}
