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

export default function FinancialReportGraph({ graphData, dataType }) {
  const [chartType, setChartType] = useState(dataType === "Line"); // portfolio는 기본 Bar, holdings는 기본 Line
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
          borderWidth: 1,
          pointRadius: 1, // 데이터 포인트를 숨김
          pointHoverRadius: 1, // 호버할 때도 숨김
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
        fill: true, // 누적형 Area Chart 스타일로 채우기
        borderWidth: 1,
        stack: 'stack1', // 누적형 스택 설정
        pointRadius: 1, // 데이터 포인트를 숨김
        pointHoverRadius: 1, // 호버할 때도 숨김
      }));
    }
  };

  const data = {
    labels: graphData.dates.slice(filterRange[0], filterRange[1] + 1),
    datasets: createDataset(),
  };

  const ChartComponent = chartType === "Bar" && dataType === "portfolio" ? Bar : Line;

  return (
    <div className={classes.chartContainer}>
      <button onClick={toggleChartType} className={classes.chartToggleButton}>
        {chartType === "Bar" ? "Line" : "Bar"}
      </button>
      <ChartComponent
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: dataType === "portfolio" ? "Portfolio Returns" : "Holdings Proportions" },
          },
          scales: {
            x: { title: { display: true, text: "Date" } },
            y: {
              title: { display: true, text: dataType === "portfolio" ? "Returns" : "비중" },
              stacked: dataType === "holdings", // holdings일 때만 누적형으로 설정
              min: dataType === "holdings" ? 0 : undefined,
              max: dataType === "holdings" ? 1 : undefined, // holdings일 때 y축을 0~1로 고정
              ticks: dataType === "holdings" ? {
                callback: (value) => `${(value * 100).toFixed(0)}%`, // holdings 데이터는 퍼센트로 표현
              } : {},
            },
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
          기간: {graphData.dates[filterRange[0]]} - {graphData.dates[filterRange[1]]}
        </span>
      </div>
    </div>
  );
}
