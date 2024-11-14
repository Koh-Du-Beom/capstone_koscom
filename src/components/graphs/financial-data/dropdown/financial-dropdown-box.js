import React, { useState, useEffect } from 'react';
import SelectedStock from './selected-stocks/selected-stock';
import FinancialDropdown from '@/components/graphs/financial-data/dropdown/financial-dropdown';
import dropdownData from '@/components/graphs/financial-data/dropdown/financial-dropdown-data';

export default function FinancialDropdownBox({ updateGraphData }) {
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [stockData, setStockData] = useState([]); // SelectedStock에서 전달받은 그래프 데이터

  // SelectedStock에서 전달된 데이터를 설정하는 함수
  const handleSelectStock = (data) => {
    setStockData(data); // 그래프 데이터를 설정
  };

  // 선택된 지표로 데이터 필터링
  useEffect(() => {
    if (stockData.length === 0 || selectedIndicators.length === 0) return;

    const filteredData = stockData.map((data) => {
      const filteredIndicators = selectedIndicators.reduce((acc, indicator) => {
        if (data.data[indicator]) {
          acc[indicator] = data.data[indicator];
        }
        return acc;
      }, {});

      return { stockName: data.stockName, data: filteredIndicators };
    });
    
    updateGraphData(filteredData); // 필터링된 데이터 부모 컴포넌트에 전달
  }, [stockData, selectedIndicators, updateGraphData]);

  return (
    <>
      <SelectedStock onSelectStock={handleSelectStock} />
      {dropdownData.map((data, index) => (
        <FinancialDropdown
          key={index}
          category={data.category}
          details={data.details}
          selectedIndicators={selectedIndicators}
          handleCheckboxChange={(name, checked) => {
            if (checked) {
              setSelectedIndicators((prev) => [...prev, name]);
            } else {
              setSelectedIndicators((prev) => prev.filter((item) => item !== name));
            }
          }}
        />
      ))}
    </>
  );
}
