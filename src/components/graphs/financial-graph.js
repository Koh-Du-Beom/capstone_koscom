import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
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
import GraphLayout from "./GraphLayout"; // 그래프 레이아웃 컴포넌트

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

export default function FinancialGraph({ selectedStockNames }) { // 선택된 종목 이름 배열
  const [chartType, setChartType] = useState("Bar");
  const [financialData, setFinancialData] = useState([]);

  // 차트 유형 변경 핸들러
  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  // 선택된 종목의 데이터를 불러오는 로직 (백엔드 API 호출이 추가될 수 있음)
  useEffect(() => {
    if (selectedStockNames.length > 0) {
      // 선택된 종목들의 데이터를 불러오는 예시
      const mockData = selectedStockNames.map((stock) => ({
        company: stock,
        financials: {
          sales: [2796048, 3022314, 2589355, 1459839], // 임시 데이터
          operatingIncome: [516339, 433766, 65670, 170499],
          netIncome: [5343249, 432234, 165670, 880499]
        },
        years: ["2021/12", "2022/12", "2023/12", "2024/06"]
      }));
      setFinancialData(mockData);
    }
  }, [selectedStockNames]);

  if (financialData.length === 0) {
    return <p>선택한 종목의 데이터를 불러오는 중입니다...</p>;
  }

  // 차트 데이터 생성
  const data = {
    labels: financialData[0].years, // X축 레이블(년도)
    datasets: financialData.flatMap((company) => [
      {
        label: `${company.company} 매출액`,
        data: company.financials.sales,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: `${company.company} 영업이익`,
        data: company.financials.operatingIncome,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: `${company.company} 순매출`,
        data: company.financials.netIncome,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      }
    ])
  };

  const ChartComponent = chartType === "Bar" ? Bar : Line;

  return (
    <div>
      <button onClick={toggleChartType}>
        {chartType === "Bar" ? "Line 차트로 보기" : "Bar 차트로 보기"}
      </button>

      <GraphLayout graphs={[
        <ChartComponent
          key="1"
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `선택한 종목 (${chartType} 차트)`,
              },
            },
          }}
        />
      ]} />
    </div>
  );
}
