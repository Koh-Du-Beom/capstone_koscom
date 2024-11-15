'use client';
import { useState, useEffect } from 'react';
import classes from './stock-list-modal.module.css';
import ComponentLoading from '@/components/loading/component-loading';
import { parseCSV } from '@/utils/parseCSV';
import Image from 'next/image';
import helpIcon from '../../../../public/svgs/help.svg'

let cachedStocks = null;

export default function StockListModal({ onClose, onAddItem }) {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const loadCSVData = async () => {
    if (cachedStocks) {
      setStocks(cachedStocks);
      return;
    }
    setIsLoading(true);
    try {
      const kospiData = await parseCSV('/csv/kospi.csv');
      const kosdaqData = await parseCSV('/csv/kosdaq.csv');
      const kospiStocks = kospiData.map(stock => ({ ...stock, 종목구분: 'KOSPI' }));
      const kosdaqStocks = kosdaqData.map(stock => ({ ...stock, 종목구분: 'KOSDAQ' }));
      const combinedData = [...kospiStocks, ...kosdaqStocks];
      cachedStocks = combinedData;
      setStocks(combinedData);
    } catch (error) {
      console.error('CSV 파싱 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCSVData();
  }, []);

  // 대소문자 구분 없이 필터링
  const filteredStocks = stocks.filter(stock =>
    stock.종목명?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.종목코드?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (stock) => {
    const item = {
      code: stock.종목코드,
      name: stock.종목명,
      marketCategory: stock.종목구분
    };
    onAddItem(item);
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

          <div className={classes.searchContainer}>
            {/* 검색 필드 */}
            <input
              type="text"
              placeholder="종목 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={classes.searchInput}
            />
            {/* 도움말 아이콘 */}
            <span
              className={classes.helpIcon}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Image 
                src={helpIcon}
                alt={`help_icon`}
                width={25}
                height={25}
              />  
              {showTooltip && (
                <span className={classes.tooltip}>
                  추가 버튼을 눌러 종목을 추가하세요
                </span>
              )}
            </span>
          </div>

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
