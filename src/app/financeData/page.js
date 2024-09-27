'use client'
import React, { useState } from 'react';
import FinancialDropdownGroup from '@/components/financial-data/dropdown/financial-dropdown-groups';
import classes from './page.module.css';

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown'); // 초기값은 'dropdown'

  const handleOptionClick = (option) => {
    setSelectedOption(option); // 선택된 옵션을 변경
  };

  return (
    <div className={classes.container}>
      <div className={classes.selectionSection}>
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

      <div className={classes.mainSection}>
        <div className={classes.inputSection}>
          {selectedOption === 'dropdown' ? (
            <FinancialDropdownGroup />
          ) : (
            <div className={classes.prompt}>
              <textarea placeholder="Enter your prompt here" />
            </div>
          )}
        </div>

        <div className={classes.graphSection}>
          {/* 그래프 컴포넌트는 여기에 추가 */}
        </div>
      </div>
    </div>
  );
}
