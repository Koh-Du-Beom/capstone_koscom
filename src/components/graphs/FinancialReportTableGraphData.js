// src/components/graphs/FinancialReportTableGraphData.js

export const newChartData = {
    labels: ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"], // 연도 라벨
    datasets: [
      {
        label: "내 포트폴리오",
        data: [5000000, 7500000, 7000000, 6500000, 8000000, 8500000, 8000000, 10000000], // 내 포트폴리오 데이터
        borderColor: "rgba(75, 192, 192, 1)", // 라인 색상
        backgroundColor: "rgba(75, 192, 192, 0.2)", // 라인 배경색
        fill: false, // 채우기 비활성화
        tension: 0.1, // 라인의 곡률
      },
      {
        label: "KOSPI",
        data: [5000000, 6000000, 4000000, 3000000, 6000000, 7000000, 6500000, 7500000], // KOSPI 데이터
        borderColor: "rgba(54, 162, 235, 1)", // 라인 색상
        backgroundColor: "rgba(54, 162, 235, 0.2)", // 라인 배경색
        fill: false, // 채우기 비활성화
        tension: 0.1, // 라인의 곡률
      },
    ],
  };
  