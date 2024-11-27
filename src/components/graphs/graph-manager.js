import React, { useState } from 'react';
import styles from './graph-manager.module.css';

export default function GraphManager({ graphData, updateGraphData }) {
  const [selectedMetric, setSelectedMetric] = useState(''); // 선택된 지표

  // 데이터를 가공하는 함수
  const processGraphData = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((metricData) => {
      const metricKey = Object.keys(metricData)[0];
      const companies = Object.keys(metricData[metricKey]);
      return {
        metric: metricKey, // 지표 이름
        firstCompany: companies[0], // 가장 먼저 나오는 종목
        totalCompanies: companies.length, // 총 종목 수
      };
    });
  };

  const dropdownItems = processGraphData(graphData);

  // 특정 그래프 데이터를 삭제하는 함수
  const deleteGraph = () => {
    if (!selectedMetric) return; // 선택된 지표가 없으면 실행하지 않음

    const updatedData = graphData.filter((item) => {
      const metricKey = Object.keys(item)[0];
      return metricKey !== selectedMetric; // 선택된 지표를 제외한 데이터만 남김
    });

    updateGraphData(updatedData); // 업데이트된 데이터로 교체
    setSelectedMetric(''); // 선택 초기화
  };

  return (
    <div className={styles.graphManager}>
      <h2>그래프 매니저</h2>
      <select
        className={styles.dropdown}
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value)}
      >
        <option value="">지표를 선택하세요</option>
        {dropdownItems.map((item, index) => (
          <option key={index} value={item.metric}>
            {`${item.firstCompany} 등 ${item.totalCompanies}개 종목의 ${item.metric} 그래프`}
          </option>
        ))}
      </select>
      <button
        className={styles.deleteButton}
        onClick={deleteGraph}
        disabled={!selectedMetric} // 선택된 지표가 없으면 버튼 비활성화
      >
        선택된 그래프 삭제
      </button>
    </div>
  );
}
