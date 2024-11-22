'use client';
import React, { useState } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import classes from './page.module.css';

export default function StockFilterPage() {
  const [stockFilters, setStockFilters] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 필터 보임/숨김 상태

  const updateFilterData = (filters) => {
    setStockFilters(filters);
  };

  return (
    <div className={classes.container}>
      {/* 필터가 숨겨진 상태에서 나타나는 버튼 */}
      {!isFilterVisible && (
        <button
          className={classes.showButton}
          onClick={() => setIsFilterVisible(true)}
        >
          필터 열기
        </button>
      )}

      {/* 필터 섹션 */}
      {isFilterVisible && (
        <div className={classes.leftSection}>
          <TechnicalFilter
            updateFilterData={updateFilterData}
            onClose={() => setIsFilterVisible(false)} // 필터 닫기 버튼
          />
        </div>
      )}

      <div className={classes.rightSection}>
        {/* 추가 콘텐츠 */}
      </div>
    </div>
  );
}
