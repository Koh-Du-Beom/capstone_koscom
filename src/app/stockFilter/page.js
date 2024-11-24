'use client';
import React, { useState, useEffect, useCallback } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table';
import ComponentLoading from '@/components/loading/component-loading'; // 로딩 컴포넌트 import
import classes from './page.module.css';

export default function StockFilterPage() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterData, setFilterData] = useState([]); // 필터 상태
  const [tableData, setTableData] = useState(null); // 테이블 데이터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const updateFilterData = useCallback((updatedFilters) => {
    setFilterData(updatedFilters);
  }, []);

  const handleToggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleApplyFilter = async () => {
    // 가중치 값 숫자 변환 및 유효성 검사
    const processedFilterData = filterData.map((indicator) => {
      const weight = Number(indicator.weight);
      if (isNaN(weight)) {
        alert(`가중치 값이 유효하지 않습니다: ${indicator.indicator}`);
        throw new Error('Invalid weight value');
      }
      return {
        ...indicator,
        weight,
      };
    });

    setIsLoading(true); // 로딩 시작
    try {
      const response = await fetch('/api/stockFilter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedIndicators: processedFilterData }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filtered data.');
      }

      const data = await response.json();
      setTableData(data.data); // 테이블에 데이터 전달
    } catch (error) {
      console.error('Error fetching filter data:', error);
      alert('필터 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className={classes.container}>
      {/* Left Section */}
      <div
        className={`${classes.leftSection} ${isFilterVisible ? classes.visible : classes.hidden}`}
      >
        <div className={classes.filterContent}>
          {isFilterVisible && (
            <TechnicalFilter
              updateFilterData={updateFilterData}
              onApplyFilter={handleApplyFilter} // 필터 적용 버튼과 연결
            />
          )}
        </div>
        <div
          className={`${classes.toggleButtonContainer} ${
            isFilterVisible ? '' : classes.centered
          }`}
        >
          <button className={classes.toggleButton} onClick={handleToggleFilter}>
            {isFilterVisible ? '닫기' : '열기'}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className={classes.rightSection}>
        {isLoading ? (
          <ComponentLoading /> // 로딩 컴포넌트 렌더링
        ) : tableData ? (
          <TechnicalTable data={tableData} /> // 테이블 컴포넌트에 데이터 전달
        ) : (
          <p>데이터가 없습니다. 필터를 적용해주세요.</p>
        )}
      </div>
    </div>
  );
}
