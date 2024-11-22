'use client';
import React, { useState } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import classes from './page.module.css';

export default function StockFilterPage() {
  const [stockFilters, setStockFilters] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(true); // 필터 보임/숨김 상태

  const updateFilterData = (filters) => {
    setStockFilters(filters);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev); // 상태 토글
  };

  return (
    <div className={classes.container}>
      <div
        className={`${classes.leftSection} ${
          isFilterVisible ? classes.visible : classes.hidden
        }`}
      >
        <TechnicalFilter updateFilterData={updateFilterData} />
        <button
          className={`${classes.toggleButton} ${
            !isFilterVisible ? classes.hiddenState : ''
          }`}
          onClick={toggleFilterVisibility}
        >
          {isFilterVisible ? '필터 숨기기' : '필터 보이기'}
        </button>
      </div>
      <div className={classes.rightSection}>
        {/* 추가 콘텐츠 */}
      </div>
    </div>
  );
}
