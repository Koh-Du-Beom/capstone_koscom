'use client';
import React, { useState, useEffect } from 'react';
import { indicators } from './technical-filter-data';
import classes from './technical-filter.module.css';

export default function TechnicalFilter({ updateFilterData, onApplyFilter }) {
  const [error, setError] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState({});
	
  useEffect(() => {
    updateFilterData(Object.values(selectedIndicators));
  }, [selectedIndicators]);

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
    if (!/^\d+$/.test(value)) {
      setError('가중치는 숫자만 입력 가능합니다.');
      return;
    }

    const weight = Math.max(0, Math.min(100, Number(value)));
    setSelectedIndicators((prev) => ({
      ...prev,
      [indicator]: { ...prev[indicator], weight },
    }));
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
