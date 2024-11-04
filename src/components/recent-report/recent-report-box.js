'use client';

import { useState, useEffect } from 'react';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';
import RecentReportItem from '@/components/recent-report/recent-report-item';
import Loading from '@/app/loading';
import classes from './recent-report-box.module.css';
import ComponentLoading from '../loading/component-loading';

export default function RecentReportItemBox() {
  const itemsPerPage = 5; // 한 페이지에 보여줄 리포트 아이템 수
  const { interestedItems } = useInterestedItems();
  const [selectedStock, setSelectedStock] = useState(null);
  const [clientItems, setClientItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);

  useEffect(() => {
    setClientItems(interestedItems);

    if (interestedItems.length > 0) {
      const initialStock = interestedItems[0];
      setSelectedStock(initialStock);
      fetchReports(initialStock.code);
    }
  }, [interestedItems]);

  const fetchReports = async (stockcode) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get-recent-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockcode })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      setReports(data);
      setCurrentPage(1); // 페이지 초기화
      setPageGroup(1); // 페이지 그룹 초기화
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownChange = async (event) => {
    const selectedCode = event.target.value;
    const selectedItem = clientItems.find(item => item.code === selectedCode);

    if (selectedItem) {
      setSelectedStock(selectedItem);
      fetchReports(selectedCode);
    } else {
      setSelectedStock(null);
      setReports([]);
    }
  };

  // 페이지네이션에 맞는 기사들을 계산하는 함수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  
  // 한 번에 보여줄 페이지 버튼 수 (5개 단위)
  const pagesPerGroup = 5;
  const totalPageGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(pageGroup * pagesPerGroup, totalPages);

  // 페이지 변경하기
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 그룹 변경하기 (화살표 버튼으로 이동)
  const handleGroupChange = (direction) => {
    if (direction === "prev" && pageGroup > 1) {
      setPageGroup(pageGroup - 1);
    } else if (direction === "next" && pageGroup < totalPageGroups) {
      setPageGroup(pageGroup + 1);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>최근 리포트</h2>

      {clientItems.length > 0 ? (
        <>
          <select onChange={handleDropdownChange} className={classes.dropdown} value={selectedStock?.code || ''}>
            {clientItems.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>

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

          {/* 페이지네이션 컨트롤 */}
          {reports.length > 0 && (
            <div className={classes.pagination}>
              <button
                onClick={() => handleGroupChange("prev")}
                disabled={pageGroup === 1}
              >
                {"<"}
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
                onClick={() => handleGroupChange("next")}
                disabled={pageGroup === totalPageGroups}
              >
                {">"}
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
