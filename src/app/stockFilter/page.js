'use client';
import React, { useState, useEffect } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import classes from './page.module.css';
import { indicators } from '@/components/technical-analysis/technical-filter/technical-filter-data';

export default function StockFilterPage() {
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 필터 보임/숨김 상태
	const [filterData, setFilterData] = useState([]);

	const createDefaultFilter = () => {
    const allIndicators = Object.values(indicators).flat(); // 모든 지표 가져오기
    return allIndicators.map((indicator) => ({
      indicator,
      condition: '상향돌파',
      weight: 5, // 디폴트 가중치
    }));
  };

	useEffect(() => {
    // 페이지 로딩 시 디폴트 필터 설정
    setFilterData(createDefaultFilter());
  }, []);

	const updateFilterData = (updatedFilters) => {
		setFilterData(updatedFilters);
	}

  const handleToggleFilter = () => {
    setIsFilterVisible((prev) => !prev); // 필터 열기/닫기 토글
  };

  return (
    <div className={classes.container}>
      {/* Left Section */}
      <div
        className={`${classes.leftSection} ${
          isFilterVisible ? classes.visible : classes.hidden
        }`}
      >
        {/* 필터 내용 */}
        <div className={classes.filterContent}>
          {isFilterVisible && <TechnicalFilter updateFilterData={updateFilterData} filterData={filterData} />}
        </div>

        {/* 열기/닫기 버튼 */}
        <div
          className={`${classes.toggleButtonContainer} ${
            isFilterVisible ? '' : classes.centered
          }`}
        >
          <button
            className={classes.toggleButton}
            onClick={handleToggleFilter}
          >
            {isFilterVisible ? '닫기' : '열기'}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className={classes.rightSection}>
				<div className={classes.rightSection}>
					<h2>선택된 필터 데이터</h2>
					{filterData.length > 0 ? (
						<ul>
							{filterData.map((item, index) => (
								<li key={index}>
									<strong>{item.indicator}</strong>: {item.condition}, 가중치: {item.weight}%
								</li>
							))}
						</ul>
					) : (
						<p>선택된 필터가 없습니다.</p>
					)}
				</div>
			

      </div>
    </div>
  );
}
