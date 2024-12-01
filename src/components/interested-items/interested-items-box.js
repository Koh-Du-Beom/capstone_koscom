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
    interestedItems,
    addInterestedItem,
    removeInterestedItem,
  } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // 로딩 상태를 Zustand에서 가져오거나, 필요하다면 컴포넌트 내에서 관리합니다.
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const addStockItem = async (stock) => {
    try {
      // 로딩 시작
      setLoading(true);

      const res = await axios.post('/api/interestedItems', {
        email: userEmail,
        name: stock.name,
        code: stock.code,
        marketCategory: stock.marketCategory,
      });

      if (res.status === 200) {
        await addInterestedItem(stock); // Zustand에서 주가 데이터를 포함하여 상태 업데이트
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to add stock item:', error.message);
    } finally {
      // 로딩 종료
      setLoading(false);
    }
  };

  const removeStockItem = async (stockCode) => {
    try {
      const res = await axios.delete('/api/interestedItems', {
        data: { email: userEmail, code: stockCode },
      });

      if (res.status === 200) {
        removeInterestedItem(stockCode); // Zustand 상태 업데이트
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
      ) : interestedItems.length === 0 ? (
        <h1 className={classes.noItemsMessage}>관심종목을 등록하세요!</h1>
      ) : (
        <div className={classes.scrollContainer}>
          <div className={classes.itemsList}>
            <InterestedItems
              items={interestedItems}
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
