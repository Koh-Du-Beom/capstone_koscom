'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import classes from './stock-list-modal.module.css'; // 스타일 모듈로 분리

export default function StockListModal({ onClose, onAddItem }) {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(`/api/stockList?itmsNm=${searchTerm}`);
          setStocks(response.data);
        } catch (error) {
          setError('Failed to fetch stock data');
        }
      }
    };

    // 입력이 끝난 후 500ms 대기 후 API 요청
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500); // 500ms의 지연 시간을 설정

    return () => clearTimeout(delayDebounceFn); 
  }, [searchTerm]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* 모달창과 오버레이 */}
      <div className={classes.overlay} onClick={onClose}></div>
      <div className={classes.modal}>
        <div className={classes.modalContent}>
          {/* 모달 헤더 */}
          <div className={classes.modalHeader}>
            <input
              type="text"
              placeholder="종목 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 입력 값 상태 업데이트
              className={classes.searchInput}
            />
            <button onClick={onClose} className={classes.closeButton}>
              &times; {/* 닫기 버튼 */}
            </button>
          </div>

          {/* 검색 결과 테이블 */}
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
                {stocks.length > 0 ? (
                  stocks.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.marketCategory}</td>
                      <td>{stock.code}</td>
                      <td>{stock.name}</td>
                      <td>
                        {/* 추가 버튼 클릭 시 해당 종목을 관심 종목에 추가 */}
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
                    <td colSpan="4">검색 결과가 없습니다.</td>
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
