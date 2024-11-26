'use client';
import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '@/store/authStore'; // zustand 상태 사용
import RecentReportItem from '@/components/recent-report/recent-report-item';
import classes from './recent-report-box.module.css';
import ComponentLoading from '../loading/component-loading';

export default function RecentReportItemBox() {
  const { interestedItems } = useAuthStore(); // zustand에서 관심 종목 가져오기
  const itemsPerPage = 3; // 한 페이지에 표시할 아이템 수
  const [selectedStock, setSelectedStock] = useState(null); // 선택된 종목
  const [reports, setReports] = useState([]); // 리포트 데이터
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 리포트 데이터를 가져오는 함수
  const fetchReports = useCallback(async (stockcode) => {
    if (!stockcode) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/get-recent-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockcode }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      setReports(data);
      setCurrentPage(1);
      setPageGroup(1);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 관심 종목 변경 시 초기 선택 및 리포트 데이터 가져오기
  useEffect(() => {
    if (interestedItems.length > 0) {
      const initialStock = interestedItems[0];
      setSelectedStock(initialStock);
      fetchReports(initialStock.code);
    } else {
      setSelectedStock(null);
      setReports([]);
    }
  }, [interestedItems, fetchReports]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelectItem = (item) => {
    setSelectedStock(item);
    fetchReports(item.code);
    setIsDropdownOpen(false);
  };

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const pagesPerGroup = 5;
  const totalPageGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(pageGroup * pagesPerGroup, totalPages);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGroupChange = (direction) => {
    if (direction === 'prev' && pageGroup > 1) {
      setPageGroup(pageGroup - 1);
    } else if (direction === 'next' && pageGroup < totalPageGroups) {
      setPageGroup(pageGroup + 1);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>최근 리포트</h2>

      {interestedItems.length > 0 ? (
        <>
          <div className={classes.dropdownContainer}>
            <div className={classes.dropdownHeader} onClick={handleDropdownToggle}>
              {selectedStock ? selectedStock.name : '종목을 선택하세요'}
              <span className={isDropdownOpen ? classes.arrowUp : classes.arrowDown}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className={classes.dropdownMenu}>
                {interestedItems.map((item) => (
                  <div
                    key={item.code}
                    className={classes.dropdownItem}
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={classes.reports}>
            {isLoading ? (
              <div className={classes.loading_container}>
                <ComponentLoading />
              </div>
            ) : (
              currentItems.map((report, index) => (
                <RecentReportItem key={index} report={report} />
              ))
            )}
          </div>

          {reports.length > 0 && (
            <div className={classes.pagination}>
              <button
                onClick={() => handleGroupChange('prev')}
                disabled={pageGroup === 1}
              >
                {'<'}
              </button>
              {[...Array(endPage - startPage + 1)].map((_, index) => {
                const pageNumber = startPage + index;
                return (
                  <button
                    key={pageNumber}
                    className={currentPage === pageNumber ? classes.activePage : ''}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handleGroupChange('next')}
                disabled={pageGroup === totalPageGroups}
              >
                {'>'}
              </button>
            </div>
          )}
        </>
      ) : (
        <h1 className={classes.no_items_message}>관심 종목을 등록하세요!</h1>
      )}
    </div>
  );
}
