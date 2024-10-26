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
  const [filterRange, setFilterRange] = useState([0, 1]); // 초기 필터 범위 설정
  const [years, setYears] = useState([]); // 기간을 담는 배열
  const [companyNames, setCompanyNames] = useState([]); // 회사 이름 목록

  // 차트 타입을 토글하는 함수
  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  // graphData가 변경될 때마다 years와 companyNames를 설정
  useEffect(() => {
    if (graphData.length > 0) {
      const periods = Object.keys(graphData[0].data); // 기간을 추출 (예: "2023/06", "2023/09")
      setYears(periods);
      setFilterRange([0, periods.length - 1]); // 초기 범위를 전체로 설정

      // 모든 지표에서 회사 목록을 수집하여 중복 없이 설정
      const allCompanies = new Set();
      graphData.forEach(metricData => {
        Object.values(metricData.data).forEach(periodData => {
          Object.keys(periodData).forEach(company => allCompanies.add(company));
        });
      });
      setCompanyNames(Array.from(allCompanies));
    }
  }, [graphData]);

  if (years.length === 0 || companyNames.length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  // 각 지표별 데이터셋 생성
  const createDatasetForMetric = (metricData) => {
    return companyNames.map((company, index) => {
      const colorIndex = index % graphColors.length;
      return {
        label: company,
        data: years.slice(filterRange[0], filterRange[1] + 1).map(
          (year) => metricData.data[year][company] || null // 데이터가 없는 경우 null로 처리
        ),
        backgroundColor: graphColors[colorIndex].backgroundColor,
        borderColor: graphColors[colorIndex].borderColor,
        borderWidth: 1,
      };
    });
  };

  // 지표별 그래프 생성
  const graphs = graphData.map((metricData) => {
    const data = {
      labels: years.slice(filterRange[0], filterRange[1] + 1),
      datasets: createDatasetForMetric(metricData),
    };
    const ChartComponent = chartType === "Bar" ? Bar : Line;

    return (
      <div key={metricData.metric} className={classes.chartContainer}>
        <ChartComponent
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: metricData.metric },
            },
          }}
        />
        <Range
          step={1}
          min={0}
          max={years.length - 1}
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
