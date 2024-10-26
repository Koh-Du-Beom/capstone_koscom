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
  const [years, setYears] = useState([]);
  const [filterRanges, setFilterRanges] = useState([]);

  const toggleChartType = (index) => {
    setChartTypes((prevTypes) => 
      prevTypes.map((type, i) => (i === index ? (type === "Bar" ? "Line" : "Bar") : type))
    );
  };

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const firstMetric = graphData[0];
      const metricName = Object.keys(firstMetric)[0];
      const metricData = firstMetric[metricName];
  
      if (metricData) {
        const firstCompany = Object.keys(metricData)[0];
        if (firstCompany && metricData[firstCompany]) {
          const extractedYears = Object.keys(metricData[firstCompany]);
          setYears(extractedYears);

          // 그래프 개수만큼 chartTypes와 filterRanges 초기화
          setChartTypes(new Array(graphData.length).fill("Line"));
          setFilterRanges(new Array(graphData.length).fill([0, extractedYears.length - 1]));
        }
      }
    }
  }, [graphData]);

  const createDatasetForMetric = (metricName, metricData, filteredYears) => {
    const companies = Object.keys(metricData);
    
    const datasets = companies.map((company, index) => {
      const colorIndex = index % graphColors.length;
      return {
        label: company,
        data: filteredYears.map(year => metricData[company][year] || null),
        backgroundColor: graphColors[colorIndex].backgroundColor,
        borderColor: graphColors[colorIndex].borderColor,
        borderWidth: 1,
      };
    });

    return { labels: filteredYears, datasets };
  };

  const graphs = graphData.map((metricObj, index) => {
    const metricName = Object.keys(metricObj)[0];
    const metricData = metricObj[metricName];

    if (!filterRanges[index] || !chartTypes[index]) return null;

    const filteredYears = years.slice(filterRanges[index][0] ?? 0, (filterRanges[index][1] ?? 0) + 1);
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
            maintainAspectRatio: true, // 비율 유지
            aspectRatio: 1, // 차트의 가로와 세로 비율 조정 (2:1 비율)
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
            max={years.length - 1}
            values={filterRanges[index] ?? [0, years.length - 1]}
            onChange={(values) => 
              setFilterRanges((prevRanges) => 
                prevRanges.map((range, i) => (i === index ? values : range))
              )
            }
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
          <span>기간: {years[filterRanges[index]?.[0] ?? 0]} - {years[filterRanges[index]?.[1] ?? years.length - 1]}</span>
        </div>
      </div>
    );
  });



  return (
    <div className={classes.graphSection}>
      <GraphLayout graphs={graphs} />
    </div>
  );
}
