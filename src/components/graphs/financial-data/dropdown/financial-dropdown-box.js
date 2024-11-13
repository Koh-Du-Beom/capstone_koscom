import React, { useState, useEffect } from 'react';
import SelectedStock from '@/components/selected-stocks/selected-stock';
import FinancialDropdown from '@/components/graphs/financial-data/dropdown/financial-dropdown';
import dropdownData from '@/components/graphs/financial-data/dropdown/financial-dropdown-data';

export default function FinancialDropdownBox({ updateGraphData }) {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);

  // 주식 선택 처리
  const handleSelectStock = (stocks) => {
    setSelectedStocks(Array.isArray(stocks) ? stocks : [stocks]);
  };

  // 지표 선택 처리
  const handleCheckboxChange = (name, checked) => {
    if (checked) {
      setSelectedIndicators((prevItems) => [...prevItems, name]);
    } else {
      setSelectedIndicators((prevItems) => prevItems.filter(item => item !== name));
    }
  };

  // 주식 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (selectedStocks.length === 0) return;

      try {
        const allStockData = await Promise.all(
          selectedStocks.map(async (stock) => {
            const response = await fetch(`/api/getGraphData-checkBox?name=${encodeURIComponent(stock)}`);
            if (!response.ok) throw new Error(`Failed to fetch data for ${stock}`);

            const stockData = await response.json();

            // 선택된 지표에 따라 각 주식 데이터를 필터링
            return selectedIndicators.reduce((acc, indicator) => {
              if (stockData[indicator]) {
                acc[indicator] = stockData[indicator];
              }
              return acc;
            }, { stockName: stock });
          })
        );

        // 모든 주식 데이터를 FinancialDataShowPage로 전달
        updateGraphData(allStockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
  }, [selectedStocks, selectedIndicators, updateGraphData]);

  return (
    <>
      <SelectedStock onSelectStock={handleSelectStock} />
      {dropdownData.map((data, index) => (
        <FinancialDropdown
          key={index}
          category={data.category}
          details={data.details}
          selectedIndicators={selectedIndicators}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
    </>
  );
}
