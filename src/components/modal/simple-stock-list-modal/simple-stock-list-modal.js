'use client';
import { useState, useEffect } from 'react';
import classes from './simple-stock-list-modal.module.css'; // 스타일 모듈로 분리
import ComponentLoading from '@/components/loading/component-loading';
import { parseCSV } from '@/utils/parseCSV'; // CSV 파서 함수 불러오기

export default function SimpleStockListModal({ onClose, onAddItem }) {
  const [stocks, setStocks] = useState([]);  // CSV로부터 얻은 주식 데이터 상태
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
  const [selectedMarket, setSelectedMarket] = useState('');  // 선택된 시장 상태

  const loadCSVData = async (market) => {
    setIsLoading(true);
    let filePath = '';

    // 선택된 시장에 따라 CSV 파일 경로 설정
    if (market === 'kospi') {
      filePath = '/csv/kospi.csv';
    } else if (market === 'kosdaq') {
      filePath = '/csv/kosdaq.csv';
    }

    try {
      const data = await parseCSV(filePath);  // CSV 파싱 후 데이터 가져오기
      setStocks(data);  // 상태 업데이트
    } catch (error) {
      console.error('CSV 파싱 중 오류 발생:', error);
    } finally {
      setIsLoading(false);  // 로딩 끝
    }
  };

  // 시장 선택 시 CSV 파일 로드
  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    loadCSVData(market);
  };

  // 검색어에 따른 필터링 처리
  const filteredStocks = stocks.filter(stock => 
    stock.종목명?.includes(searchTerm) || stock.종목코드?.includes(searchTerm)
  );

  // 종목 추가 버튼 클릭 시, 부모 컴포넌트로 종목코드와 종목명 전달
  const handleAddItem = (stock) => {
    const item = {
      code: stock.종목코드,  // 종목 코드 필드
      name: stock.종목명     // 종목 명 필드
    };
    onAddItem(item);  // 부모 컴포넌트에 전달
  };

  return (
    <div>
      <div className={classes.overlay} onClick={onClose}></div>
      <div className={classes.modal}>
        <div className={classes.modalContent}>
          <div className={classes.modalHeader}>
            {/* 시장 선택 버튼 */}
            <div>
              <button
                className={`${classes.marketButton} ${selectedMarket === 'kospi' ? classes.activeButton : ''}`}
                onClick={() => handleMarketSelect('kospi')}
                type="button"
              >
                코스피
              </button>
              <button
                className={`${classes.marketButton} ${selectedMarket === 'kosdaq' ? classes.activeButton : ''}`}
                onClick={() => handleMarketSelect('kosdaq')}
                type="button"
              >
                코스닥
              </button>
            </div>
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
                  <th>종목코드</th>
                  <th>종목명</th>
                  <th>추가</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="3">
                      <div className={classes.loadingContainer}>
                        <ComponentLoading /> {/* 로딩 컴포넌트를 tbody 중앙에 위치 */}
                      </div>
                    </td>
                  </tr>
                ) : filteredStocks.length > 0 ? (
                  filteredStocks.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.종목코드}</td>
                      <td>{stock.종목명}</td>
                      <td>
                        <button
                          className={classes.addButton}
                          onClick={() => handleAddItem(stock)}  // 종목 추가 버튼
                          type="button"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: 'center' }} colSpan="3">
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
