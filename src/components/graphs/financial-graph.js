import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import graph_Mock_data from "./graphData";
import graphColors from "./graph-colors";
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
import GraphLayout from "./GraphLayout"; 

// ChartJS 모듈 등록
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

export default function FinancialGraph({ selectedStockNames, selectedIndicators }) {
  const [chartType, setChartType] = useState("Bar");
  const [financialData, setFinancialData] = useState([]);

  // 차트 유형 변경 핸들러
  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  // 선택된 종목의 데이터를 graph_Mock_data에서 필터링하는 로직
  useEffect(() => {
    if (selectedStockNames.length > 0) {
      const filteredData = graph_Mock_data.filter(company =>
        selectedStockNames.includes(company.company)
      );
      setFinancialData(filteredData);
    }
  }, [selectedStockNames]);

  if (financialData.length === 0) {
    return <p>선택한 종목의 데이터를 불러오는 중입니다...</p>;
  }

  // 차트 데이터 생성 함수
  const createDatasetForMetric = (metricKey, label) => {
    return financialData.map((company, index) => {
      const colorIndex = index % graphColors.length; // 최대 10개의 고정 색상
      return {
        label: `${company.company}`,
        data: company.financials[metricKey],
        backgroundColor: graphColors[colorIndex].backgroundColor,
        borderColor: graphColors[colorIndex].borderColor,
        borderWidth: 1,
      };
    });
  };

  // 선택된 항목을 기반으로 동적으로 데이터셋을 생성
  const selectedMetrics = Object.keys(selectedIndicators).filter(indicator => selectedIndicators[indicator]);
  
  const graphs = selectedMetrics.map((metric) => {
    const metricKeyMapping = {
      "매출액": "sales",
      "영업이익": "operatingIncome",
      "순매출": "netIncome",
      // 필요한 다른 지표도 추가 가능
    };
    const metricKey = metricKeyMapping[metric] || "netIncome"; // 기본값: 순매출
    const data = {
      labels: financialData[0].years,
      datasets: createDatasetForMetric(metricKey, metric),
    };
    const ChartComponent = chartType === "Bar" ? Bar : Line;

    return (
      <ChartComponent
        key={metric}
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: `${metric}` },
          },
        }}
      />
    );
  });

  return (
    <div>
      <button onClick={toggleChartType}>
        {chartType === "Bar" ? "Line 차트로 보기" : "Bar 차트로 보기"}
      </button>
      <GraphLayout graphs={graphs} />
    </div>
  );
}
