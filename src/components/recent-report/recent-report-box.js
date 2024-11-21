'use client'
import { useState, useEffect } from 'react';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';
import RecentReportItem from '@/components/recent-report/recent-report-item';
import classes from './recent-report-box.module.css';
import ComponentLoading from '../loading/component-loading';

export default function RecentReportItemBox() {
  const itemsPerPage = 3;
  const { interestedItems } = useInterestedItems();
  const [selectedStock, setSelectedStock] = useState(null);
  const [clientItems, setClientItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      setCurrentPage(1);
      setPageGroup(1);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelectItem = (item) => {
    setSelectedStock(item);
    fetchReports(item.code);
    setIsDropdownOpen(false);
  };

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
          <div className={classes.dropdownContainer}>
            <div className={classes.dropdownHeader} onClick={handleDropdownToggle}>
              {selectedStock ? selectedStock.name : '종목을 선택하세요'}
              <span className={isDropdownOpen ? classes.arrowUp : classes.arrowDown}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className={classes.dropdownMenu}>
                {clientItems.map((item) => (
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
