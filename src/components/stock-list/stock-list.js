'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어를 저장할 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 검색어가 있을 경우 URL에 포함하여 요청
        const response = await axios.get(`/api/stockList?itmsNm=${searchTerm}`);
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
        setError('Failed to fetch stock data');
      }
    };

    fetchData();
  }, [searchTerm]); // 검색어가 변경될 때마다 API 요청

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Stock List</h1>
      {/* 검색 입력 필드 추가 */}
      <input
        type="text"
        placeholder="종목 이름 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // 입력 값 상태 업데이트
      />
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>
            {/* 종목 코드와 이름, 가격 변화 및 등락률 출력 */}
            {stock.code}: {stock.name} (가격 변화: {stock.priceChange > 0 ? '증가' : '감소'}, 등락률: {stock.priceChangeRate}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
