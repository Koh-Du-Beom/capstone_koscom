import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Range } from "react-range";
import graph_Mock_data from "./graphData";
import graphColors from "./graph-colors";
import classes from './financial-graph.module.css';

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
  const [chartType, setChartType] = useState("Line");
  const [financialData, setFinancialData] = useState([]);
  const [filterRange, setFilterRange] = useState([0, 10]); // 기본값
  const [maxRange, setMaxRange] = useState(10); // 슬라이더의 최대 범위 설정

  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  useEffect(() => {
    if (selectedStockNames.length > 0) {
      const filteredData = graph_Mock_data.filter(company =>
        selectedStockNames.includes(company.company)
      );
      setFinancialData(filteredData);

      if (filteredData.length > 0) {
        const maxLength = filteredData[0].years.length - 1;
        setFilterRange([0, maxLength]); // 기본값을 최대 범위로 설정
        setMaxRange(maxLength); // 슬라이더의 최대값을 업데이트
      }
    }
  }, [selectedStockNames]);

  if (financialData.length === 0) {
    return <p>입력이 완료되지 않았습니다</p>;
  }

  const createDatasetForMetric = (metricKey, label) => {
    return financialData.map((company, index) => {
      const colorIndex = index % graphColors.length;
      return {
        label: `${company.company}`,
        data: company.financials[metricKey].slice(filterRange[0], filterRange[1] + 1),
        backgroundColor: graphColors[colorIndex].backgroundColor,
        borderColor: graphColors[colorIndex].borderColor,
        borderWidth: 1,
      };
    });
  };

  const selectedMetrics = Object.keys(selectedIndicators).filter(indicator => selectedIndicators[indicator]);

  const graphs = selectedMetrics.map((metric) => {
    const metricKeyMapping = {
      "매출액": "sales",
      "영업이익": "operatingIncome",
      "순매출": "netIncome",
    };
    const metricKey = metricKeyMapping[metric] || "netIncome";
    const data = {
      labels: financialData[0].years.slice(filterRange[0], filterRange[1] + 1),
      datasets: createDatasetForMetric(metricKey, metric),
    };
    const ChartComponent = chartType === "Bar" ? Bar : Line;

    return (
      <div key={metric} className={classes.chartContainer}>
        <ChartComponent
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: `${metric}` },
            },
          }}
        />
        <Range
          step={1}
          min={0}
          max={maxRange}
          values={filterRange}
          onChange={(values) => setFilterRange(values)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className={classes.rangeSliderTrack} // 스타일링된 트랙 사용
            >
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props;  
            return (
              <div
                key={`thumb-${index}`} 
                {...restProps} 
                className={classes.rangeSliderThumb}
              />
            );
          }}
        />
        <div className={classes.rangeValue}>
          <span>기간: {financialData[0].years[filterRange[0]]} - {financialData[0].years[filterRange[1]]}</span>
        </div>
      </div>
    );
  });

  return (
    <div className={classes.graphSection}>
      <button onClick={toggleChartType}>
        {chartType === "Bar" ? "Line 차트로 보기" : "Bar 차트로 보기"}
      </button>
      <GraphLayout graphs={graphs} />
    </div>
  );
}
