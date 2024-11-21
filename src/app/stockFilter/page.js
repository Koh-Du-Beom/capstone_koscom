
'use client';
import React, { useState } from 'react';
import { useInterestedItems } from '@/contexts/InterestedItemsContext'; // 관심 종목 컨텍스트
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table'; // 테이블 컴포넌트
import TechnicalWeightsManager from '@/components/technical-analysis/technical-table/technical-weight/technical-weights-manager';
import TechnicalAnalysisModal from '@/components/modal/technical-analysis-modal/technical-analysis-modal';
import classes from './page.module.css';
import axios from 'axios';

export default function StockFilterPage() {
  // Context API를 활용한 관심 종목 구독
  const { interestedItems } = useInterestedItems();

  // 선택된 지표 상태
  const [selectedIndicators, setSelectedIndicators] = useState({
   
  });

  // API 응답 데이터 저장 상태
  const [apiResponse, setApiResponse] = useState(null); // 초기 상태는 null

  // 가중치 상태 추가
  const [indicatorWeights, setIndicatorWeights] = useState({});

  // 가중치 설정 모달 상태
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

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
				exchange_code : item.marketCategory,
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
          <button
            className={classes.apiButton}
            onClick={() => setIsWeightModalOpen(true)}
          >
            가중치 변경
          </button>
        </div>
        {/* TechnicalTable에 API 응답 데이터와 가중치 정보 전달 */}
        {apiResponse && (
          <TechnicalTable data={apiResponse} indicatorWeights={indicatorWeights} />
        )}
      </div>

      {/* 가중치 설정 모달 */}
      {isWeightModalOpen && (
        <TechnicalAnalysisModal onClose={() => setIsWeightModalOpen(false)}>
          <TechnicalWeightsManager
            selectedIndicators={Object.keys(selectedIndicators)} // 객체의 키를 배열로 변환하여 전달
            updateWeights={(weights) => {
              setIndicatorWeights(weights);
              setIsWeightModalOpen(false);
            }}
          />
        </TechnicalAnalysisModal>
      )}
    </div>
  );
}
