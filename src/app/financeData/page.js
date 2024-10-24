'use client';
import React, { useState, useEffect } from 'react';
import FinancialDropdown from '@/components/graphs/financial-data/dropdown/financial-dropdown';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import dropdownData from '@/components/graphs/financial-data/dropdown/financial-dropdown-data';
import SelectedStock from '@/components/graphs/selected-stock';
import FinancialPrompt from '@/components/graphs/financial-data/prompt/financial-prompt';
import graph_Mock_data from '@/components/graphs/graphData'; // 임시 JSON 데이터 import

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown');
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]); 
  const [graphData, setGraphData] = useState([]); // JSON 데이터를 관리하는 새로운 상태

  // 체크박스 선택 시 상태 업데이트 핸들러
  const handleCheckboxChange = (name, checked) => {
		if (checked) {
			setCheckedItems((prevItems) => [...prevItems, name]); // 체크된 항목을 배열에 추가
		} else {
			setCheckedItems((prevItems) => prevItems.filter(item => item !== name)); // 체크 해제된 항목은 배열에서 제거
		}
	};
	

  const handleOptionClick = (option) => {
    setSelectedOption(option); 
  };

  // 선택된 종목을 배열로 FinancialGraph에 전달
  const handleSelectStock = (stocks) => {
    setSelectedStocks(stocks); 
  };
	

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <div className={classes.selectionSection}>
          <h2 className={classes.title}>주식 분석</h2>
          <button
            className={`${classes.button} ${selectedOption === 'dropdown' ? classes.activeButton : ''}`}
            onClick={() => handleOptionClick('dropdown')}
          >
            Dropdown
          </button>
          <button
            className={`${classes.button} ${selectedOption === 'prompt' ? classes.activeButton : ''}`}
            onClick={() => handleOptionClick('prompt')}
          >
            Prompt
          </button>
        </div>

        <InterestedItemsBox />

        <div className={classes.inputSection}>
          {selectedOption === 'dropdown' ? (
            dropdownData.map((data, index) => (
              <FinancialDropdown
                key={index}
                category={data.category}
                details={data.details}
                checkedItems={checkedItems}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))
          ) : (
            <FinancialPrompt />
          )}
        </div>
      </div>

      <div className={classes.rightSection}>
        <SelectedStock onSelectStock={handleSelectStock} />
        <div className={classes.graphSection}>
          <FinancialGraph graphData={graph_Mock_data} />
        </div>
      </div>
    </div>
  );
}
