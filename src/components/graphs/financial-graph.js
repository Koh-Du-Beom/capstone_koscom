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
  const [financialData, setFinancialData] = useState([]);
  const [filterRange, setFilterRange] = useState([0, 10]); // 기본값
  const [maxRange, setMaxRange] = useState(10); // 슬라이더의 최대 범위 설정

  const toggleChartType = () => {
    setChartType(chartType === "Bar" ? "Line" : "Bar");
  };

  // 데이터가 변경될 때마다 financialData 상태를 업데이트
  useEffect(() => {
    if (graphData.length > 0) {
      setFinancialData(graphData);

      // JSON 데이터 기반으로 슬라이더의 범위 설정
      const maxLength = graphData[0].years.length - 1;
      setFilterRange([0, maxLength]); // 기본값을 최대 범위로 설정
      setMaxRange(maxLength); // 슬라이더의 최대값을 업데이트
    }
  }, [graphData]);

  if (financialData.length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  // 각 지표(매출액, 영업이익, 순매출)에 대해 데이터셋을 생성
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

  // 렌더링할 지표의 키 매핑
  const metricKeyMapping = {
    "매출액": "sales",
    "영업이익": "operatingIncome",
    "순매출": "netIncome",
  };

  // 그래프 생성
  const graphs = Object.keys(metricKeyMapping).map((metric) => {
    const metricKey = metricKeyMapping[metric];
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
