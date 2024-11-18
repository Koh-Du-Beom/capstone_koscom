'use client';
import React, { useState } from 'react';
import { useInterestedItems } from '@/contexts/InterestedItemsContext'; // 관심 종목 컨텍스트
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table'; // 테이블 컴포넌트
import classes from './page.module.css';
import axios from 'axios';

export default function StockFilterPage() {
  // Context API를 활용한 관심 종목 구독
  const { interestedItems } = useInterestedItems();

  // 선택된 지표 상태
  const [selectedIndicators, setSelectedIndicators] = useState({
    'Awesome Oscillator': '상향돌파',
    'RSI': '상향돌파',
    'Stochastic Oscillator': '상향돌파',
    'Stochastic RSI': '상향돌파',
    'True Strength Index (TSI)': '상향돌파',
  });

  // API 응답 데이터 저장 상태
  const [apiResponse, setApiResponse] = useState(null); // 초기 상태는 null

  // API 호출 함수
  const fetchDataFromBackend = async () => {
    if (interestedItems.length === 0) {
      console.warn('선택된 종목이 없습니다.');
      return;
    }

    if (Object.keys(selectedIndicators).length === 0) {
      console.warn('선택된 지표가 없습니다.');
      return;
    }

    try {
      // 관심 종목 데이터를 가공하여 백엔드에 전달
      const stocks = interestedItems.map((item) => ({
        code: item.code,
        name: item.name,
      }));

      const response = await axios.post('/api/stockFilter', {
        stocks,
        selectedIndicators,
      });

      // API 응답 데이터를 그대로 저장
      console.log('API 응답 데이터:', response.data);
      setApiResponse(response.data);
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <h2 className={classes.title}>종목 및 필터 설정</h2>
        <InterestedItemsBox />
        <TechnicalFilter
          selectedIndicators={selectedIndicators}
          setSelectedIndicators={setSelectedIndicators}
        />
      </div>
      <div className={classes.rightSection}>
        <div className={classes.apiButtonContainer}>
          <button className={classes.apiButton} onClick={fetchDataFromBackend}>
            데이터 호출
          </button>
        </div>
        {/* TechnicalTable에 API 응답 데이터 전달 */}
        {apiResponse && <TechnicalTable data={apiResponse} />}
      </div>
    </div>
  );
}
