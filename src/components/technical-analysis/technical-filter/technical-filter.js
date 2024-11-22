'use client';
import React, { useState } from 'react';
import { indicators } from './technical-filter-data';
import classes from './technical-filter.module.css';

export default function TechnicalFilter({ updateFilterData, onClose }) {
  const [error, setError] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState({});

  // 가중치 합 계산
  const calculateTotalWeight = (updatedIndicators) => {
    return Object.values(updatedIndicators)
      .filter((val) => val && val.weight)
      .reduce((sum, val) => sum + val.weight, 0);
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (indicator) => {
    setSelectedIndicators((prev) => {
      const newSelected = { ...prev };
      if (newSelected[indicator]) {
        // 지표 해제 시 데이터 삭제
        delete newSelected[indicator];
        updateFilterData(Object.values(newSelected));
      } else {
        // 선택된 지표 추가
        newSelected[indicator] = { indicator, condition: '상향돌파', weight: 0 };
        updateFilterData(Object.values(newSelected));
      }
      setError('');
      return newSelected;
    });
  };

  // 조건 선택 변경 핸들러
  const handleSelectChange = (indicator, value) => {
    setSelectedIndicators((prev) => {
      const updatedIndicators = {
        ...prev,
        [indicator]: { ...prev[indicator], condition: value },
      };
      updateFilterData(Object.values(updatedIndicators)); // 부모 컴포넌트에 업데이트 전달
      return updatedIndicators;
    });
  };

  // 가중치 변경 핸들러
  const handleWeightChange = (indicator, value) => {
    if (!/^\d+$/.test(value)) {
      setError('가중치는 숫자만 입력 가능합니다.');
      return;
    }

    const weight = Math.max(0, Math.min(100, Number(value))); // 0~100 범위 제한
    setSelectedIndicators((prev) => {
      const updatedIndicators = {
        ...prev,
        [indicator]: { ...prev[indicator], weight },
      };

      const totalWeight = calculateTotalWeight(updatedIndicators);

      if (totalWeight > 100) {
        setError('가중치 합은 100%를 초과할 수 없습니다.');
        return prev;
      } else {
        setError('');
        updateFilterData(Object.values(updatedIndicators)); // 부모 컴포넌트에 업데이트 전달
        return updatedIndicators;
      }
    });
  };

  return (
    <div className={classes.filterContainer}>
			<button className={classes.closeButton} onClick={onClose}>필터 닫기</button>
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
      {error && <div className={classes.error}>{error}</div>}
    </div>
  );
}
