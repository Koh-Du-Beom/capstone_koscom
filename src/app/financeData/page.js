'use client';
import React, { useState } from 'react';
import FinancialDropdown from '@/components/financial-data/dropdown/financial-dropdown';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import dropdownData from '@/components/financial-data/dropdown/financial-dropdown-data';
import SelectedStock from '@/components/graphs/selected-stock';

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown');
	const [checkedItems, setCheckedItems] = useState({});

  // 체크박스 선택 시 상태 업데이트 핸들러
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); 
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

        {/* 입력 섹션 */}
        <div className={classes.inputSection}>
					{selectedOption === 'dropdown' ? (
						// map 함수를 사용하여 FinancialDropdown 컴포넌트를 직접 렌더링
						dropdownData.map((data, index) => (
							<FinancialDropdown
								key={index}
								category={data.category}
								details={data.details}
								checkedItems={checkedItems}  // 상태 전달
								handleCheckboxChange={handleCheckboxChange}  // 핸들러 전달
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
        {/* 그래프 섹션 */}
				<SelectedStock />

        <div className={classes.graphSection}>
          <FinancialGraph />
        </div>
      </div>
    </div>
  );
}
