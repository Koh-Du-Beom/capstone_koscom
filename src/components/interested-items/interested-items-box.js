'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
    setInterestedItems,
    addInterestedItem,
    removeInterestedItem,
  } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockDataList, setStockDataList] = useState([]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  // 데이터베이스에서 관심 종목 가져오기
  const fetchInterestedItems = useCallback(async () => {
    if (!userEmail) return;

    try {
      const response = await axios.get('/api/interestedItems', {
        params: { email: userEmail },
      });

      if (response.status === 200) {
        setInterestedItems(response.data.items); // Zustand 상태 업데이트
      }
    } catch (error) {
      console.error('Failed to fetch interested items:', error.message);
    }
  }, [userEmail, setInterestedItems]);

  // 관심 종목의 주가 데이터 가져오기
  const fetchStockData = useCallback(async () => {
    if (interestedItems.length === 0) return;

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
  }, [interestedItems]);

  // 초기 렌더링 시 데이터 로드
  useEffect(() => {
    if (isLoggedIn) {
      fetchInterestedItems();
    }
  }, [isLoggedIn, fetchInterestedItems]);

  useEffect(() => {
    fetchStockData();
  }, [interestedItems, fetchStockData]);

  const addStockItem = async (stock) => {
    try {
      const res = await axios.post('/api/interestedItems', {
        email: userEmail,
        name: stock.name,
        code: stock.code,
        marketCategory: stock.marketCategory,
      });

      if (res.status === 200) {
        addInterestedItem(stock);
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
        removeInterestedItem(stockCode);
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
