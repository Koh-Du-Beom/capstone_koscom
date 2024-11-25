import React, { useState, useEffect } from 'react';
import SelectedStock from './selected-stocks/selected-stock';
import FinancialDropdown from '@/components/financial-data/dropdown/financial-dropdown';
import dropdownData from '@/components/financial-data/dropdown/financial-dropdown-data';

export default function FinancialDropdownBox({ updateGraphData }) {
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [stockData, setStockData] = useState([]);

  // SelectedStock에서 데이터를 받는 함수
  const handleSelectStock = (data) => {
    setStockData(Array.isArray(data) ? data : [data]); // 데이터가 배열인지 확인
  };

  // 데이터 필터링 및 재구성
  useEffect(() => {
    if (stockData.length === 0 || selectedIndicators.length === 0) {
      updateGraphData([])
      return;
    }
      

    const restructuredData = selectedIndicators.reduce((acc, indicator) => {
      const indicatorData = stockData.reduce((stocksAcc, { stockName, data }) => {
        const stockIndicatorData = Object.entries(data)
          .reduce((datesAcc, [date, values]) => {
            if (values[indicator] !== undefined) {
              datesAcc[date] = values[indicator];
            }
            return datesAcc;
          }, {});

        if (Object.keys(stockIndicatorData).length > 0) {
          stocksAcc[stockName] = stockIndicatorData; // stockName을 key로 사용
        }
        return stocksAcc;
      }, {});

      if (Object.keys(indicatorData).length > 0) {
        acc.push({ [indicator]: indicatorData });
      }
      return acc;
    }, []);
    
    updateGraphData(restructuredData);
  }, [selectedIndicators, stockData]);

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
            setSelectedIndicators((prev) =>
              checked ? [...prev, name] : prev.filter((item) => item !== name)
            );
          }}
        />
      ))}
    </>
  );
}
