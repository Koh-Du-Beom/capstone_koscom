'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import InterestedItems from './interested-items';
import SimpleStockListModal from '../modal/stock-list-modal/stock-list-modal';
import classes from './interested-items-box.module.css';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';
import axios from 'axios';
import ComponentLoading from '../loading/component-loading';

const InterestedItemsBox = () => {
  const { interestedItems, addInterestedItem, removeInterestedItem } = useInterestedItems();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockDataList, setStockDataList] = useState([]);
  const hasFetchedData = useRef(false); // API 호출 여부 상태
  const fetchInProgress = useRef(false); // 중복 호출 방지
  const [hasMounted, setHasMounted] = useState(false); // 클라이언트 렌더링 상태

  // 클라이언트에서만 렌더링
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 관심 종목 데이터를 서버에서 가져오는 함수
  const fetchStockData = useCallback(async () => {
    if (fetchInProgress.current || hasFetchedData.current || interestedItems.length === 0) {
      return; // 이미 호출 중이거나 호출된 경우
    }

    fetchInProgress.current = true; // 호출 상태 설정
    setLoading(true);
    try {
      const promises = interestedItems.map(async (stock) => {
        const response = await axios.get('/api/stockList', {
          params: {
            code: stock.code,
            name: stock.name,
            marketCategory: stock.marketCategory,
          },
        });
        return response.data;
      });

      const results = await Promise.all(promises);
      setStockDataList(results);
      hasFetchedData.current = true; // 호출 완료
    } catch (error) {
      console.error('Failed to fetch stock data:', error.message);
    } finally {
      fetchInProgress.current = false; // 호출 상태 해제
      setLoading(false);
    }
  }, [interestedItems]);

  // 초기 렌더링 및 주기적 데이터 갱신
  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchStockData(); // 초기 렌더링 시 한 번 호출
    }

    const interval = setInterval(() => {
      hasFetchedData.current = false; // 데이터 갱신 플래그 초기화
      fetchStockData(); // 주기적으로 호출
    }, 60 * 1000 * 60); // 1시간마다 호출

    return () => clearInterval(interval);
  }, [fetchStockData]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const addStockItem = (stock) => {
    if (interestedItems.find((item) => item.code === stock.code)) {
      return;
    }
  
    addInterestedItem({
      name: stock.name,
      code: stock.code,
      marketCategory: stock.marketCategory,
    });
  
    // 데이터 fetch 플래그 초기화 및 강제 fetch 호출
    hasFetchedData.current = false;
    setTimeout(fetchStockData, 0); // 상태 업데이트 직후 fetch 보장
    setIsModalOpen(false);
  };
  

  const removeStockItem = (stockCode) => {
		removeInterestedItem(stockCode);
	
		// 상태 업데이트: 삭제된 아이템 제외한 데이터로 갱신
		const updatedStockDataList = stockDataList.filter((item) => item.code !== stockCode);
		setStockDataList(updatedStockDataList);
	
		// 데이터가 없으면 fetch 플래그 초기화 (추후 추가 시 갱신 가능)
		if (updatedStockDataList.length === 0) {
			hasFetchedData.current = false;
		}
	};
	

  if (!hasMounted) {
    // 클라이언트가 마운트되기 전에는 렌더링하지 않음
    return null;
  }

  return (
    <section className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>
          <span className={classes.star}>★</span> 관심 종목
          <span className={classes.counts}>{interestedItems.length}개</span>
        </h2>
        <div className={classes.actions}>
          <span className={classes.action} onClick={toggleEditMode}>
            {isEditMode ? '완료' : '편집'}
          </span>
          <span className={classes.action} onClick={toggleModal}>추가</span>
        </div>
      </div>

      {loading ? (
        <div className={classes.loadingContainer}>
          <ComponentLoading />
        </div>
      ) : stockDataList.length === 0 ? (
        <h1 className={classes.noItemsMessage}>
          관심종목을 등록하세요!
        </h1>
      ) : (
        <div className={classes.scrollContainer}>
          <div className={classes.itemsList}>
            <InterestedItems
              items={stockDataList}
              isEditMode={isEditMode}
              onRemoveItem={removeStockItem}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <SimpleStockListModal onClose={toggleModal} onAddItem={addStockItem} />
      )}
    </section>
  );
};

export default InterestedItemsBox;
