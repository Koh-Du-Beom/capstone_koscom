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
import GraphLayout from "./graph-layout"; 

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
  const [chartTypes, setChartTypes] = useState([]);
  const [filterRanges, setFilterRanges] = useState({}); // 그래프별 filterRanges를 객체로 저장

  const toggleChartType = (index) => {
    setChartTypes((prevTypes) =>
      prevTypes.map((type, i) => (i === index ? (type === "Bar" ? "Line" : "Bar") : type))
    );
  };

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const initialChartTypes = new Array(graphData.length).fill("Line");
      const initialFilterRanges = {};

      graphData.forEach((metricObj, index) => {
        const metricName = Object.keys(metricObj)[0];
        const metricData = metricObj[metricName];
        const firstCompany = Object.keys(metricData)[0];
        const metricYears = firstCompany ? Object.keys(metricData[firstCompany]) : [];

        initialFilterRanges[index] = [0, metricYears.length - 1];
      });

      setChartTypes(initialChartTypes);
      setFilterRanges(initialFilterRanges);
    }
  }, [graphData]);

  const formatYearToQuarter = (year) => {
    const [yearPart, monthPart] = year.split("-");
    const quarter =
      monthPart === "03" ? "Q1" :
      monthPart === "06" ? "Q2" :
      monthPart === "09" ? "Q3" :
      monthPart === "12" ? "Q4" : "";
    return `${yearPart}${quarter}`;
  };

  const createDatasetForMetric = (metricName, metricData, years) => {
    const companies = Object.keys(metricData);
    
    const datasets = companies.map((company, index) => {
      const colorIndex = index % graphColors.length;

      // 연도를 정렬하고 포맷 변환
      const sortedYears = [...years].sort((a, b) => new Date(a) - new Date(b));
      const formattedYears = sortedYears.map(formatYearToQuarter);

      return {
        label: company,
        data: sortedYears.map(year => metricData[company][year] || null),
        backgroundColor: graphColors[colorIndex].backgroundColor,
        borderColor: graphColors[colorIndex].borderColor,
        borderWidth: 1,
      };
    });

    const sortedYears = [...years].sort((a, b) => new Date(a) - new Date(b));
    const formattedYears = sortedYears.map(formatYearToQuarter);

    return { labels: formattedYears, datasets }; // 포맷된 연도를 labels로 사용
  };

  const graphs = graphData.map((metricObj, index) => {
    const metricName = Object.keys(metricObj)[0];
    const metricData = metricObj[metricName];

    if (!filterRanges[index] || !chartTypes[index]) return null;

    // 각 그래프별로 x축에 사용할 연도를 설정합니다.
    const metricYears = Object.keys(metricData[Object.keys(metricData)[0]]);
    const sortedYears = [...metricYears].sort((a, b) => new Date(a) - new Date(b)); // 날짜 기준 정렬
    const filteredYears = sortedYears.slice(filterRanges[index][0], filterRanges[index][1] + 1);
    const data = createDatasetForMetric(metricName, metricData, filteredYears);
    const ChartComponent = chartTypes[index] === "Bar" ? Bar : Line;

    return (
      <div key={index} className={classes.chartContainer}>
        <button
          onClick={() => toggleChartType(index)}
          className={classes.chartToggleButton}
        >
          {chartTypes[index] === "Bar" ? "Line" : "Bar"}
        </button>
        <ChartComponent
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: metricName },
            },
            scales: {
              x: { title: { display: true, text: "기간" } },
            },
            elements: {
              point: {
                radius: 0,
              }
            }
          }}
        />
        {metricYears.length > 0 && (
          <Range
            step={1}
            min={0}
            max={metricYears.length - 1}
            values={filterRanges[index]}
            onChange={(values) =>
              setFilterRanges((prevRanges) => ({
                ...prevRanges,
                [index]: values,
              }))
            }
            renderTrack={({ props, children }) => (
              <div {...props} className={classes.rangeSliderTrack}>
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div {...props} key={index} className={classes.rangeSliderThumb} />
            )}
          />
        )}
        <div className={classes.rangeValue}>
          <span>기간: {sortedYears[filterRanges[index][0]]} - {sortedYears[filterRanges[index][1]]}</span>
        </div>
      </div>
    );
  });

  return <div className={classes.graphSection}><GraphLayout graphs={graphs} /></div>;
}
