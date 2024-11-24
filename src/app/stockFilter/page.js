'use client'
import React, { useState, useEffect, useCallback } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table';
import classes from './page.module.css';

export default function StockFilterPage() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterData, setFilterData] = useState([]); // 필터 상태
  const [tableData, setTableData] = useState(null); // 테이블 데이터

	const updateFilterData = useCallback((updatedFilters) => {
    setFilterData(updatedFilters);
  }, []);

  const handleToggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  // 필터 적용 (API 호출 또는 데이터 처리)
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
	
			console.log('tableData : ', data.data);
			
		} catch (error) {
			console.error('Error fetching filter data:', error);
			alert('필터 데이터를 불러오는데 실패했습니다.');
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
        <div className={`${classes.toggleButtonContainer} ${isFilterVisible ? '' : classes.centered}`}>
          <button className={classes.toggleButton} onClick={handleToggleFilter}>
            {isFilterVisible ? '닫기' : '열기'}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className={classes.rightSection}>
        {tableData ? (
          <TechnicalTable data={tableData} /> // 테이블 컴포넌트에 데이터 전달
        ) : (
          <p>데이터가 없습니다. 필터를 적용해주세요.</p>
        )}
      </div>
    </div>
  );
}
