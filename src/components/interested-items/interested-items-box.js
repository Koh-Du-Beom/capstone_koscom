'use client';
import React, { useState, useEffect } from 'react';
import InterestedItems from './interested-items';
import StockListModal from '../modal/stock-list-modal/stock-list-modal';
import classes from './interested-items-box.module.css';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';

const InterestedItemsBox = () => {
  const { interestedItems, addInterestedItem, removeInterestedItem } = useInterestedItems();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
  const [hasMounted, setHasMounted] = useState(false); // 클라이언트에서만 렌더링되는 상태

  // 클라이언트에서만 실행되도록 설정
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 클라이언트에서만 렌더링되도록 설정
  if (!hasMounted) {
    return null; // 클라이언트에서만 렌더링할 부분을 제외하고 서버 측에서 렌더링되지 않음
  }

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
    addInterestedItem(stock);
    setIsModalOpen(false);
  };

  const removeStockItem = (stockCode) => {
    removeInterestedItem(stockCode);
		
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
      
      {interestedItems.length === 0 ? (
        <h1 className={classes.noItemsMessage}>
          관심종목을 등록하세요!
        </h1>
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
