// InterestedItemsBox 컴포넌트
'use client';
import React, { useState, useEffect } from 'react';
import InterestedItems from './interested-items';
import StockListModal from '../modal/stock-list-modal/stock-list-modal';
import classes from './interested-items-box.module.css';
import axios from 'axios';
import ComponentLoading from '../loading/component-loading';
import useAuthStore from '@/store/authStore';

const InterestedItemsBox = () => {
  const {
    email: userEmail,
    isLoggedIn,
    interestedItems,
    addInterestedItem,
    removeInterestedItem,
    fetchInterestedItems,
  } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockDataList, setStockDataList] = useState([]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  // 관심 종목의 주가 데이터 가져오기
  const fetchStockData = async () => {
    if (interestedItems.length === 0) {
      setStockDataList([]); // 관심 종목이 없으면 주가 데이터도 초기화
      return;
    }

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
    } catch (error) {
      console.error('Failed to fetch stock data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 로그인 상태 변경 시 관심 종목 가져오기
  useEffect(() => {
    if (isLoggedIn && interestedItems.length === 0) {
      fetchInterestedItems(); // Zustand 액션 호출
    }
  }, [isLoggedIn, interestedItems.length, fetchInterestedItems]);

  // 관심 종목이 변경될 때 주가 데이터 가져오기
  useEffect(() => {
    fetchStockData();
  }, [interestedItems]);

  const addStockItem = async (stock) => {
    try {
      const res = await axios.post('/api/interestedItems', {
        email: userEmail,
        name: stock.name,
        code: stock.code,
        marketCategory: stock.marketCategory,
      });

      if (res.status === 200) {
        addInterestedItem(stock); // Zustand 상태 업데이트
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
        removeInterestedItem(stockCode); // Zustand 상태 업데이트
        setStockDataList((prev) =>
          prev.filter((item) => item.code !== stockCode)
        );
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
          <span className={classes.action} onClick={toggleModal}>
            추가
          </span>
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
