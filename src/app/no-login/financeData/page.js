'use client';
import React, { useEffect, useState } from 'react';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import FinancialDropdownBox from '@/components/financial-data/dropdown/financial-dropdown-box'; // 새로 생성된 FinancialDropdownBox 컴포넌트 import
import FinancialPrompt from '@/components/financial-data/prompt/financial-prompt';
import graph_Mock_data from '@/components/graphs/graph-data';

export default function NoLoginFinancialDataShowPage() {
  const [graphData, setGraphData] = useState([]);

  const updateGraphData = (newData) => {
    // restructuredData를 graphData에 그대로 덮어쓰기
    setGraphData(newData);
  };  

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <div className={classes.selectionSection}>
          <div className={classes.inputSection}>
            <FinancialDropdownBox updateGraphData={updateGraphData} />
          </div>
        </div>
        
      </div>

      <div className={classes.rightSection}>      
        <div className={classes.graphSection}>
        {graphData.length > 0 ? (
          <div className={classes.graphSection}>      
            <FinancialGraph graphData={graphData} updateGraphData={updateGraphData} option={'dropdown'}/>
          </div>
        ) : (
          <div className={classes.emptyState}>보고싶은 지표를 선택해주세요!</div>
        )}
        </div>
      </div>
    </div>
  );
}
