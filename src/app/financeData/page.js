'use client';
import React, { useState } from 'react';
import FinancialDropdown from '@/components/graphs/financial-data/dropdown/financial-dropdown';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import dropdownData from '@/components/graphs/financial-data/dropdown/financial-dropdown-data';
import SelectedStock from '@/components/graphs/selected-stock';

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown');
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedStocks, setSelectedStocks] = useState([]); 

  // 체크박스 선택 시 상태 업데이트 핸들러
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 옵션 클릭 핸들러
  const handleOptionClick = (option) => {
    setSelectedOption(option); 
  };

  // 선택된 종목을 배열로 FinancialGraph에 전달
  const handleSelectStock = (stocks) => {
    if (Array.isArray(stocks)) {
      setSelectedStocks(stocks);
    } else {
      setSelectedStocks([stocks]); // stocks가 배열이 아닌 경우 배열로 변환
    }
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
            <div className={classes.prompt}>
              <textarea placeholder="프롬프트 입력창" />
            </div>
          )}
        </div>
      </div>

      <div className={classes.rightSection}>
        <SelectedStock onSelectStock={handleSelectStock} />
        <div className={classes.graphSection}>
          {/* FinancialGraph에 데이터를 전달할 때 유효성 검사를 추가 */}
          {selectedStocks.length > 0 && (
            <FinancialGraph selectedStockNames={selectedStocks} selectedIndicators={checkedItems} />
          )}
        </div>
      </div>
    </div>
  );
}
