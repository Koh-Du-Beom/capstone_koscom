'use client';
import React, { useState, useEffect } from 'react';
import { indicators } from './technical-filter-data';
import classes from './technical-filter.module.css';

export default function TechnicalFilter({ filterData, updateFilterData, onApplyFilter }) {
  const [error, setError] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState({});
	
  useEffect(() => {
    updateFilterData(Object.values(selectedIndicators));
  }, [selectedIndicators]);

  useEffect(() => {
    // filterData를 selectedIndicators의 형식으로 변환
    const syncSelectedIndicators = {};
    filterData.forEach((data) => {
      const { indicator, condition, weight } = data; // filterData의 구조에서 필요한 키 추출
      syncSelectedIndicators[indicator] = { indicator, condition, weight };
    });
  
    // 변환된 데이터를 상태로 설정
    setSelectedIndicators(syncSelectedIndicators);
  }, []);
  

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    const allSelected = {};
    Object.values(indicators).flat().forEach((indicator) => {
      allSelected[indicator] = { indicator, condition: '상향돌파', weight: 5 };
    });
    setSelectedIndicators(allSelected);
  };

  // 전체 해제 핸들러
  const handleDeselectAll = () => {
    setSelectedIndicators({});
  };

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
		// 모든 weight 값에 대한 유효성 검사
		const invalidWeight = Object.values(selectedIndicators).some(
			(indicator) =>
				indicator.weight === '' ||
				!/^\d+$/.test(indicator.weight) ||
				Number(indicator.weight) < 0 ||
				Number(indicator.weight) > 100
		);
	
		if (invalidWeight) {
			alert('가중치에는 0에서 100 사이의 숫자만 입력 가능합니다.');
			return;
		}
	
		if (Object.keys(selectedIndicators).length === 0) {
			alert('선택된 필터가 없습니다.');
			return;
		}
	
		onApplyFilter(); // 부모 컴포넌트로 필터 적용 요청
	};

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (indicator) => {
    setSelectedIndicators((prev) => {
      const newSelected = { ...prev };
      if (newSelected[indicator]) {
        delete newSelected[indicator];
      } else {
        newSelected[indicator] = { indicator, condition: '상향돌파', weight: 10 };
      }
      return newSelected;
    });
  };

  // 조건 선택 변경 핸들러
  const handleSelectChange = (indicator, value) => {
    setSelectedIndicators((prev) => ({
      ...prev,
      [indicator]: { ...prev[indicator], condition: value },
    }));
  };

  // 가중치 변경 핸들러
  const handleWeightChange = (indicator, value) => {
		// 상태 업데이트
		setSelectedIndicators((prev) => ({
			...prev,
			[indicator]: { ...prev[indicator], weight: value },
		}));
	
		// 에러 메시지 초기화
		setError('');
	
		// 유효성 검사
		if (value === '') {
			// 빈 문자열은 허용
			return;
		}
	
		if (!/^\d+$/.test(value)) {
			setError('가중치는 숫자만 입력 가능합니다.');
			return;
		}
	
		const weight = Number(value);
	
		if (weight < 0 || weight > 100) {
			setError('가중치는 0에서 100 사이여야 합니다.');
			return;
		}
	
		// 에러가 없으므로 에러 메시지를 지웁니다.
		setError('');
	};

  return (
    <div className={classes.filterContainer}>
      {/* 상단 버튼: 전체 선택 / 전체 해제 / 필터 적용 */}
      <div className={classes.topButtons}>
        <button onClick={handleSelectAll}>전체 선택</button>
        <button onClick={handleDeselectAll}>전체 해제</button>
        <button onClick={handleApplyFilter}>필터 적용</button>
      </div>

      {/* 필터 테이블 */}
      {Object.entries(indicators).map(([section, items]) => (
        <div key={section} className={classes.section}>
          <div className={classes.header}>
            <h3 className={classes.title}>{section}</h3>
          </div>
          <div className={classes.table}>
            {items.map((indicator) => (
              <div key={indicator} className={classes.row}>
                <div className={classes.checkboxContainer}>
                  <input
                    type="checkbox"
                    className={classes.checkbox}
                    checked={selectedIndicators.hasOwnProperty(indicator)}
                    onChange={() => handleCheckboxChange(indicator)}
                  />
                  <label className={classes.indicatorLabel}>{indicator}</label>
                </div>
                <div className={classes.inputContainer}>
                  <select
                    className={classes.select}
                    disabled={!selectedIndicators.hasOwnProperty(indicator)}
                    value={selectedIndicators[indicator]?.condition || '상향돌파'}
                    onChange={(e) => handleSelectChange(indicator, e.target.value)}
                  >
                    <option value="상향돌파">상향돌파</option>
                    <option value="하향돌파">하향돌파</option>
                  </select>
                  <input
                    type="text"
                    className={classes.weightInput}
                    disabled={!selectedIndicators.hasOwnProperty(indicator)}
                    value={selectedIndicators[indicator]?.weight || ''}
                    onChange={(e) => handleWeightChange(indicator, e.target.value)}
                    placeholder="가중치 (%)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 에러 메시지 */}
      {error && <div className={classes.error}>{error}</div>}
    </div>
  );
}
