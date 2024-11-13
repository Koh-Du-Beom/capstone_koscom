'use client';
import React, { useState } from 'react';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import FinancialDropdownBox from '@/components/graphs/financial-data/dropdown/financial-dropdown-box'; // 새로 생성된 FinancialDropdownBox 컴포넌트 import
import FinancialPrompt from '@/components/graphs/financial-data/prompt/financial-prompt';

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown');
  const [graphData, setGraphData] = useState([]);

  const updateGraphDataWithDropdown = (newData) => {
    // 기존 graphData에 새 데이터를 추가
    setGraphData((prevData) => [...prevData, ...newData]);
  };

  const updateGraphDataWithPrompt = (newData) => {
    // 프롬프트로 받은 데이터로 그래프를 업데이트
    setGraphData(newData);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setGraphData([]); // 옵션이 변경될 때마다 그래프 데이터 초기화
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <div className={classes.selectionSection}>
          <h2 className={classes.title}>주식 분석</h2>
          <div className={classes.option_container}>
            <button
              className={`${classes.button} ${selectedOption === 'dropdown' ? classes.activeButton : ''} ${selectedOption === 'dropdown' ? classes.disabledButton : ''}`}
              onClick={() => handleOptionClick('dropdown')}
              disabled={selectedOption === 'dropdown'}
            >
              Dropdown
            </button>
            <button
              className={`${classes.button} ${selectedOption === 'prompt' ? classes.activeButton : ''} ${selectedOption === 'prompt' ? classes.disabledButton : ''}`}
              onClick={() => handleOptionClick('prompt')}
              disabled={selectedOption === 'prompt'}
            >
              Prompt
            </button>
          </div>  
        </div>

        <div className={classes.inputSection}>
          {selectedOption === 'dropdown' ? (
            <FinancialDropdownBox updateGraphData={updateGraphDataWithDropdown} />
          ) : (
            <FinancialPrompt updateGraphData={updateGraphDataWithPrompt} />
          )}
        </div>
      </div>

      <div className={classes.rightSection}>      
        <div className={classes.graphSection}>
          <FinancialGraph graphData={graphData} />
        </div>
      </div>
    </div>
  );
}
