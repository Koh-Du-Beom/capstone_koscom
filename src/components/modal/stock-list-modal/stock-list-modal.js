'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import classes from './stock-list-modal.module.css'; // 스타일 모듈로 분리
import ComponentLoading from '@/components/loading/component-loading';

export default function StockListModal({ onClose, onAddItem }) {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/stockList?itmsNm=${searchTerm}`);
          setStocks(response.data);
        } catch (error) {
          setError('Failed to fetch stock data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className={classes.overlay} onClick={onClose}></div>
      <div className={classes.modal}>
        <div className={classes.modalContent}>
          <div className={classes.modalHeader}>
            <input
              type="text"
              placeholder="종목 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={classes.searchInput}
            />
            <button onClick={onClose} className={classes.closeButton}>
              &times;
            </button>
          </div>

          <div className={classes.tableContainer}>
            <table className={classes.modalTable}>
              <thead>
                <tr>
                  <th>시장구분</th>
                  <th>종목코드</th>
                  <th>종목이름</th>
                  <th>추가</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4">
                      <div className={classes.loadingContainer}>
                        <ComponentLoading /> {/* 로딩 컴포넌트를 tbody 중앙에 위치 */}
                      </div>
                    </td>
                  </tr>
                ) : stocks.length > 0 ? (
                  stocks.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.marketCategory}</td>
                      <td>{stock.code}</td>
                      <td>{stock.name}</td>
                      <td>
                        <button
                          className={classes.addButton}
                          onClick={() => onAddItem(stock)}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: 'center' }} colSpan="4">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
