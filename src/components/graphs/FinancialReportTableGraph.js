
import React from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// 차트 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FinancialReportTableGraph = ({ data, title, type }) => {
  // 차트 옵션 설정 - type이 'area'일 때는 y축을 전체 차지하도록 설정
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
    },
    scales: {
      x: { title: { display: true, text: '기간' }, type: 'category' },
      y: {
        title: { display: true, text: '비율' },
        stacked: type === 'area', // 영역 차트일 때는 y축을 스택으로 쌓아 올림
        max: type === 'area' ? 1.0 : undefined, // 영역 차트일 때 y축 최댓값을 1.0으로 고정
      },
    },
  };

  // 각 데이터셋에 고유한 색상을 지정
  const colors = [
    'rgba(255, 179, 186, 0.6)', 'rgba(255, 223, 186, 0.6)', 'rgba(255, 255, 186, 0.6)',
    'rgba(186, 255, 201, 0.6)', 'rgba(186, 225, 255, 0.6)', 'rgba(204, 204, 255, 0.6)',
    'rgba(255, 204, 229, 0.6)', 'rgba(255, 153, 153, 0.6)', 'rgba(153, 204, 255, 0.6)',
    'rgba(204, 255, 204, 0.6)'
  ];

  const datasets = data.datasets.map((dataset, index) => ({
    ...dataset,
    fill: type === 'area',
    borderColor: colors[index % colors.length].replace('0.6', '1'), // 선명한 경계 색상
    backgroundColor: colors[index % colors.length], // 파스텔톤 반투명 배경색
  }));

  const chartData = {
    ...data,
    datasets,
  };

  // 데이터 유효성 검사
  if (
    !data || 
    !data.labels || 
    !Array.isArray(data.labels) || 
    !data.datasets || 
    !Array.isArray(data.datasets) || 
    data.datasets.length === 0
  ) {
    return <p>차트 데이터를 불러오는 중입니다...</p>;
  }

  // 차트 렌더링 - 고정된 높이 및 가로 폭을 설정
  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default FinancialReportTableGraph;
