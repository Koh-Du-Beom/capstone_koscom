import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Range } from "react-range";
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

export default function FinancialGraph({ graphData }) {
  const [chartType, setChartType] = useState("Line");
  const [years, setYears] = useState([]);
  const [filterRange, setFilterRange] = useState([0, 1]);

  // 차트 타입을 토글하는 함수
  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      // 첫 번째 지표에서 기간을 추출하여 설정
      const firstMetric = graphData[0];
      const metricName = Object.keys(firstMetric)[0]; // 첫 번째 지표 이름
      const metricData = firstMetric[metricName];
  
      if (metricData) {
        const firstCompany = Object.keys(metricData)[0]; // 첫 번째 회사
        if (firstCompany && metricData[firstCompany]) {
          const extractedYears = Object.keys(metricData[firstCompany]);
          setYears(extractedYears);
          setFilterRange([0, extractedYears.length - 1]); // 슬라이더 범위를 전체로 초기화
        }
      }
    }
  }, [graphData]);
  
  
  // 각 지표별 데이터셋 생성
  const createDatasetForMetric = (metricName, metricData) => {
    const companies = Object.keys(metricData);
    const filteredYears = years.slice(filterRange[0], filterRange[1] + 1); // 필터링된 기간
    
    const datasets = companies.map((company, index) => {
      const colorIndex = index % graphColors.length;
      return {
        label: company,
        data: filteredYears.map(year => metricData[company][year] || null), // 필터링된 연도에 맞춰 데이터 슬라이싱
        backgroundColor: graphColors[colorIndex].backgroundColor,
        borderColor: graphColors[colorIndex].borderColor,
        borderWidth: 1,
      };
    });

    return { labels: filteredYears, datasets };
  };

  // 그래프 배열 생성
  const graphs = graphData.map((metricObj, index) => {
    const metricName = Object.keys(metricObj)[0]; // 지표 이름 (예: "PER" 또는 "PBR")
    const metricData = metricObj[metricName];
    const data = createDatasetForMetric(metricName, metricData);
    const ChartComponent = chartType === "Bar" ? Bar : Line;

    return (
      <div key={index} className={classes.chartContainer}>
        <ChartComponent
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: metricName },
            },
            scales: {
              x: { title: { display: true, text: "기간" } },
            },
          }}
        />
        {years.length > 0 && (
          <Range
            step={1}
            min={0}
            max={years.length - 1} // years 배열이 비어 있지 않은 경우에만 max 설정
            values={filterRange}
            onChange={(values) => setFilterRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className={classes.rangeSliderTrack}
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                key={index}
                className={classes.rangeSliderThumb}
              />
            )}
          />
        )}
        <div className={classes.rangeValue}>
          <span>기간: {years[filterRange[0]]} - {years[filterRange[1]]}</span>
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
