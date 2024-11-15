'use client';
import { useState, useEffect } from 'react';
import classes from './stock-list-modal.module.css';
import ComponentLoading from '@/components/loading/component-loading';
import { parseCSV } from '@/utils/parseCSV';

let cachedStocks = null; // 캐시된 데이터를 저장할 전역 변수

export default function StockListModal({ onClose, onAddItem }) {
  const [stocks, setStocks] = useState([]);  // CSV로부터 얻은 주식 데이터 상태
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태

  // CSV 파일 로드 함수
  const loadCSVData = async () => {
    // 캐시된 데이터가 있는지 확인
    if (cachedStocks) {
      setStocks(cachedStocks);
      return;
    }

    setIsLoading(true);

    try {
      // 두 개의 CSV 파일을 모두 로드
      const kospiData = await parseCSV('/csv/kospi.csv');
      const kosdaqData = await parseCSV('/csv/kosdaq.csv');

      // 각 데이터에 종목구분 필드 추가
      const kospiStocks = kospiData.map(stock => ({ ...stock, 종목구분: 'KOSPI' }));
      const kosdaqStocks = kosdaqData.map(stock => ({ ...stock, 종목구분: 'KOSDAQ' }));

      // 데이터를 합쳐서 상태 업데이트 및 캐시에 저장
      const combinedData = [...kospiStocks, ...kosdaqStocks];
      cachedStocks = combinedData; // 캐시에 저장
      setStocks(combinedData);
    } catch (error) {
      console.error('CSV 파싱 중 오류 발생:', error);
    } finally {
      setIsLoading(false);  // 로딩 끝
    }
  };

  // 컴포넌트가 최초 로딩될 때만 CSV 데이터를 캐시에 로드
  useEffect(() => {
    loadCSVData();
  }, []);

  // 검색어에 따른 필터링 처리
  const filteredStocks = stocks.filter(stock => 
    stock.종목명?.includes(searchTerm) || stock.종목코드?.includes(searchTerm)
  );

  // 종목 추가 버튼 클릭 시, 부모 컴포넌트로 종목코드와 종목명 전달
  const handleAddItem = (stock) => {
    const item = {
      code: stock.종목코드,        // 종목 코드 필드
      name: stock.종목명,          // 종목 명 필드
      marketCategory: stock.종목구분  // 종목 구분 필드
    };
    onAddItem(item);  // 부모 컴포넌트에 전달
  };

  return (
    <div>
      <div className={classes.overlay} onClick={onClose}></div>
      <div className={classes.modal}>
        <div className={classes.modalContent}>
          <div className={classes.modalHeader}>
            <button onClick={onClose} className={classes.closeButton} type="button">
              &times;
            </button>
          </div>

          {/* 검색 필드 */}
          <input
            type="text"
            placeholder="종목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.searchInput}
          />

          <div className={classes.tableContainer}>
            <table className={classes.modalTable}>
              <thead>
                <tr>
                  <th>종목구분</th>
                  <th>종목코드</th>
                  <th>종목명</th>
                  <th>추가</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4">
                      <div className={classes.loadingContainer}>
                        <ComponentLoading />
                      </div>
                    </td>
                  </tr>
                ) : searchTerm && filteredStocks.length > 0 ? (
                  filteredStocks.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.종목구분}</td>
                      <td>{stock.종목코드}</td>
                      <td>{stock.종목명}</td>
                      <td>
                        <button
                          className={classes.addButton}
                          onClick={() => handleAddItem(stock)}
                          type="button"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: 'center' }} colSpan="4">
                      {searchTerm ? '검색 결과가 없습니다.' : '검색어를 입력해 주세요.'}
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
