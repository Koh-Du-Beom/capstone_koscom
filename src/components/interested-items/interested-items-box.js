'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import InterestedItems from './interested-items';
import StockListModal from '../modal/stock-list-modal/stock-list-modal';
import classes from './interested-items-box.module.css';
import axios from 'axios';
import ComponentLoading from '../loading/component-loading';
import useAuthStore from '@/store/authStore';

const InterestedItemsBox = () => {
  const { email: userEmail, isLoggedIn } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interestedItems, setInterestedItems] = useState([]); // 관심 종목 상태
  const [stockDataList, setStockDataList] = useState([]); // API 결과 상태
  const fetchInProgress = useRef(false); // 중복 호출 방지
  const hasFetchedData = useRef(false); // 데이터 갱신 상태

  const resetInterestedItems = useCallback(() => {
    setInterestedItems([]);
    setStockDataList([]);
    hasFetchedData.current = false; // 데이터 상태 초기화
  }, [isLoggedIn]);

  // 관심 종목 데이터를 데이터베이스에서 가져오는 함수
  const fetchInterestedItems = useCallback(async () => {
    if (!userEmail) return;

    try {
      const response = await axios.get('/api/interestedItems', {
        params: { email: userEmail }, // 현재 로그인된 유저의 이메일
      });

      if (response.status === 200) {
        setInterestedItems(response.data.items); // 관심 종목 상태 업데이트
        hasFetchedData.current = false; // 새로운 데이터로 갱신 필요
      }
    } catch (error) {
      console.error('Failed to fetch interested items:', error.message);
    }
  }, [userEmail]);

  const fetchStockData = async (items = interestedItems) => {
    
    // 플래그 검증: 이미 호출 중이거나, 데이터가 최신 상태라면 함수 종료
    if (fetchInProgress.current) {
      console.log('현재 fetch가 진행 중입니다.');
      return;
    }
    if (hasFetchedData.current && stockDataList.length === items.length) {
      console.log('이미 최신 데이터를 보유하고 있습니다.');
      return;
    }
    if (items.length === 0) {
      console.log('관심 종목이 없습니다.');
      return;
    }
  
    fetchInProgress.current = true; // 호출 상태 설정
    setLoading(true);
  
    try {
      const promises = items.map(async (stock) => {
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
  
      // API 결과 상태 업데이트
      setStockDataList(results);
      hasFetchedData.current = true; // 데이터 갱신 플래그 설정
    } catch (error) {
      console.error('Failed to fetch stock data:', error.message);
    } finally {
      fetchInProgress.current = false; // 호출 상태 해제
      setLoading(false);
    }
  };
  
  // 관심 종목 변경 시 API 호출
  useEffect(() => {
    if (interestedItems.length > 0) {
      hasFetchedData.current = false; // 관심 종목 변경 시 데이터 갱신 플래그 초기화
      fetchStockData(interestedItems);
    }
  }, [interestedItems]);
  


  // 초기 렌더링 시 관심 종목 가져오기 및 API 호출
  useEffect(() => {
    const initializeData = async () => {
      await fetchInterestedItems(); // 데이터베이스에서 관심 종목 가져오기
    };

    initializeData();
  }, [fetchInterestedItems]); 

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const addStockItem = async (stock) => {
    try {
      const res = await axios.post('/api/interestedItems', {
        email: userEmail,
        name: stock.name,
        code: stock.code,
        marketCategory: stock.marketCategory,
      });
  
      if (res.status === 200) {
        console.log('관심 종목 추가 성공:', res.data);
  
        // 관심 종목 상태 업데이트
        setInterestedItems((prev) => [
          ...prev,
          {
            name: stock.name,
            code: stock.code,
            marketCategory: stock.marketCategory,
          },
        ]);
  
        // fetchStockData 호출 제거 (useEffect가 상태 변경을 감지하도록 처리)
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to add stock item:', error.message);
    }
  };
  

  const removeStockItem = async (stockCode) => {
    try {
      const res = await axios.delete('/api/interestedItems', {
        data: { email: userEmail, code: stockCode },
      });

      if (res.status === 200) {
        console.log('관심 종목 삭제 성공:', res.data);

        // 관심 종목 상태 업데이트
        setInterestedItems((prev) => prev.filter((item) => item.code !== stockCode));

        // API 결과 상태 업데이트
        setStockDataList((prev) => prev.filter((item) => item.code !== stockCode));
      }
    } catch (error) {
      console.error('Failed to remove stock item:', error.message);
    }
  };

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
        <h1 className={classes.noItemsMessage}>관심종목을 등록하세요!</h1>
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
        <StockListModal onClose={toggleModal} onAddItem={addStockItem} />
      )}
    </section>
  );
};

export default InterestedItemsBox;
