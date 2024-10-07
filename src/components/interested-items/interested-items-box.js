'use client';
import React, { useState, useEffect } from 'react';
import InterestedItems from './interested-items';
import StockListModal from '../stock-list-modal/stock-list-modal';
import classes from './interested-items-box.module.css';
import { getLocalStorageItems, setLocalStorageItems } from '@/utils/localStorage';

const LOCAL_STORAGE_KEY = 'interestedItems'; // 로컬스토리지에 저장할 키

const InterestedItemsBox = () => {
  const [items, setItems] = useState([]); // 관심 종목 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태

  // 페이지 로드 시 로컬스토리지에서 항목 불러오기
  useEffect(() => {
    const savedItems = getLocalStorageItems(LOCAL_STORAGE_KEY);
    setItems(savedItems);
  }, []);

  // 모달 열기/닫기 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 편집 모드 토글 함수
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 관심 종목에 종목 추가하는 함수
  const addStockItem = (stock) => {
    setItems((prevItems) => {
      // 이미 추가된 종목이면 무시
      if (prevItems.find((item) => item.code === stock.code)) {
        return prevItems;
      }
      const newItems = [...prevItems, stock];
      setLocalStorageItems(LOCAL_STORAGE_KEY, newItems); // 로컬스토리지에 저장
      setIsModalOpen(false); // 모달 닫기
      return newItems;
    });
  };

  // 관심 종목에서 종목 삭제하는 함수
  const removeStockItem = (stockCode) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.code !== stockCode);
      setLocalStorageItems(LOCAL_STORAGE_KEY, newItems); // 로컬스토리지에 저장
      return newItems;
    });
  };

  return (
    <section className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>
          <span className={classes.star}>★</span> 관심 종목
          <span className={classes.counts}>{items.length}개</span>
        </h2>
        <div className={classes.actions}>
          <span className={classes.action} onClick={toggleEditMode}>
            {isEditMode ? '완료' : '편집'}
          </span>
          <span className={classes.action} onClick={toggleModal}>추가</span>
        </div>
      </div>
      <div className={classes.itemsList}>
        <InterestedItems 
          items={items} 
          isEditMode={isEditMode} 
          onRemoveItem={removeStockItem} 
        />
      </div>

      {isModalOpen && (
        <StockListModal onClose={toggleModal} onAddItem={addStockItem} />
      )}
    </section>
  );
};

export default InterestedItemsBox;
