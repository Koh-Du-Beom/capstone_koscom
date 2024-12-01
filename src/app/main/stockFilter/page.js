'use client';
import React, { useState, useEffect, useCallback } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table';
import ComponentLoading from '@/components/loading/component-loading';
import classes from './page.module.css';
import defaultFilterData from '@/components/technical-analysis/technical-filter/default-filter-data';

export default function StockFilterPage() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterData, setFilterData] = useState(defaultFilterData); // 필터 상태
  const [tableData, setTableData] = useState(null); // 테이블 데이터
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Y축 스크롤 비활성화
    document.body.style.overflowY = 'hidden';

    handleApplyFilter();

    return () => {
      // 컴포넌트 언마운트 시 스크롤 복원
      document.body.style.overflowY = 'auto';
    };
  }, []);

  const updateFilterData = useCallback((updatedFilters) => {
    setFilterData(updatedFilters);
  }, []);

  const handleToggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleApplyFilter = async () => {
    setIsLoading(true);
    const processedFilterData = filterData.map((indicator) => {
      const weight = Number(indicator.weight);
      if (isNaN(weight)) {
        alert(`가중치 값이 유효하지 않습니다: ${indicator.indicator}`);
        throw new Error('Invalid weight value');
      }
      return { ...indicator, weight };
    });

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
      setTableData(data.data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
      alert('필터 데이터를 불러오는데 실패했습니다.');
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      {/* Left Section */}
      <div className={`${classes.leftSection} ${isFilterVisible ? classes.visible : classes.hidden}`}>
        <div className={classes.filterContent}>
          {isFilterVisible && (
            <TechnicalFilter
              filterData={filterData}
              updateFilterData={updateFilterData}
              onApplyFilter={handleApplyFilter}
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
        {
          isLoading ? (
            <div className={classes.noData}>
              <ComponentLoading /> 
            </div>
          ) : (
            tableData ? (
              <TechnicalTable data={tableData} />
            ) : (
              <p className={classes.noData}>데이터가 없습니다. 필터를 적용해주세요.</p>
            )
          )
        }      
      </div>
    </div>
  );
}
