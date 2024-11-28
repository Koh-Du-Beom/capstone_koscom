'use client';
import React, { useEffect, useState } from 'react';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import FinancialDropdownBox from '@/components/financial-data/dropdown/financial-dropdown-box'; // 새로 생성된 FinancialDropdownBox 컴포넌트 import
import FinancialPrompt from '@/components/financial-data/prompt/financial-prompt';
import graph_Mock_data from '@/components/graphs/graph-data';
import GraphManager from '@/components/graphs/graph-manager';

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown');
  const [graphData, setGraphData] = useState([]);

  const updateGraphData = (newData) => {
    // restructuredData를 graphData에 그대로 덮어쓰기
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
          {/* <h2 className={classes.title}>주식 분석</h2> */}
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
            <FinancialDropdownBox updateGraphData={updateGraphData} />
          ) : (
            <FinancialPrompt updateGraphData={updateGraphData} />
          )}
        </div>
      </div>

      <div className={classes.rightSection}>      
        <div className={classes.graphSection}>
        {graphData.length > 0 ? (
          <div className={classes.graphSection}>      
            <FinancialGraph graphData={graphData} updateGraphData={updateGraphData} option={selectedOption}/>
          </div>
        ) : (
          <div className={classes.emptyState}>보고싶은 지표를 선택해주세요!</div>
        )}
        </div>
      </div>
    </div>
  );
}
