import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Range } from "react-range";
import graphColors from "./graph-colors";
import classes from "./financial-report-graph.module.css";
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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler // Filler를 등록하여 누적형 Area Chart 스타일을 사용할 수 있도록 설정
);

// 연도-월을 쿼터 형식으로 변환
const formatYearToQuarter = (year) => {
  const [yearPart, monthPart] = year.split("-");
  const month = parseInt(monthPart, 10); // 문자열을 숫자로 변환

  let quarter = "";
  if (month >= 1 && month <= 3) {
    quarter = "Q1";
  } else if (month >= 4 && month <= 6) {
    quarter = "Q2";
  } else if (month >= 7 && month <= 9) {
    quarter = "Q3";
  } else if (month >= 10 && month <= 12) {
    quarter = "Q4";
  }

  return `${yearPart}${quarter}`; // 연도와 분기를 결합
};


export default function FinancialReportGraph({ graphData, dataType }) {
  const [chartType, setChartType] = useState(dataType === "Line");
  const [filterRange, setFilterRange] = useState([0, graphData.dates.length - 1]);

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "Line" ? "Bar" : "Line"));
  };

  const createDataset = () => {
    if (dataType === "portfolio") {
      return [
        {
          label: "Portfolio Returns",
          data: graphData.returns.slice(filterRange[0], filterRange[1] + 1),
          backgroundColor: graphColors[0].backgroundColor,
          borderColor: graphColors[0].borderColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ];
    } else if (dataType === "holdings") {
      return Object.keys(graphData.returns[0]).map((asset, index) => ({
        label: asset,
        data: graphData.returns
          .slice(filterRange[0], filterRange[1] + 1)
          .map((item) => item[asset]),
        backgroundColor: graphColors[index % graphColors.length].backgroundColor,
        borderColor: graphColors[index % graphColors.length].borderColor,
        fill: true,
        borderWidth: 3,
        stack: "stack1",
        pointRadius: 0,
        pointHoverRadius: 0,
      }));
    }
  };

  const data = {
    labels: graphData.dates
      .slice(filterRange[0], filterRange[1] + 1)
      .map(formatYearToQuarter), // x축 레이블 포맷팅
    datasets: createDataset(),
  };

  const ChartComponent = chartType === "Bar" && dataType === "portfolio" ? Bar : Line;

  return (
    <div className={classes.chartContainer}>
      <div className={classes.yAxisTitle}>
        {dataType === "portfolio" ? "수익" : "비중"}
      </div>
      <div className={classes.chartContent}>
        {dataType === "portfolio" && ( // 포트폴리오일 때만 버튼 표시
          <button onClick={toggleChartType} className={classes.chartToggleButton}>
            {chartType === "Bar" ? "Line" : "Bar"}
          </button>
        )}
        <ChartComponent
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: dataType === "portfolio" ? "Portfolio Returns" : "Holdings Proportions",
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Date" },
              },
              y: {
                stacked: dataType === "holdings",
                min: dataType === "holdings" ? 0 : undefined,
                max: dataType === "holdings" ? 1 : undefined,
                ticks: {
                  callback: (value) =>
                    dataType === "holdings"
                      ? `${(value * 100).toFixed(0)}%`
                      : `${value}%`, // 포트폴리오에도 % 추가
                },
              },
            },
            elements: {
              point: { radius: 0 },
              line: { tension: 0.4 },
            },
          }}
        />
        <Range
          step={1}
          min={0}
          max={graphData.dates.length - 1}
          values={filterRange}
          onChange={(values) => setFilterRange(values)}
          renderTrack={({ props, children }) => (
            <div {...props} className={classes.rangeSliderTrack}>
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div {...props} key={index} className={classes.rangeSliderThumb} />
          )}
        />
        <div className={classes.rangeValue}>
          <span>
            기간: {graphData.dates[filterRange[0]]} ~ {graphData.dates[filterRange[1]]}
          </span>
        </div>
      </div>
    </div>
  );
}
