'use client';
import React, { useState } from 'react';
import SelectedStockItems from './selected-stock-items';
import StockListModal from '../stock-list-modal/stock-list-modal'; // 종목 선택 모달
import classes from './selected-stock.module.css'; // 스타일 모듈
import { getLocalStorageItems } from '@/utils/localStorage'; // 로컬스토리지에서 아이템을 가져오는 함수

const LOCAL_STORAGE_KEY = 'interestedItems'; // InterestedItems의 로컬스토리지 키

const SelectedStock = () => {
  const [items, setItems] = useState([]); // 선택된 종목 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태

  // 모달 열기/닫기 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 편집 모드 토글 함수
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 관심종목 불러오기 함수
  const fetchInterestedItems = () => {
    const savedItems = getLocalStorageItems(LOCAL_STORAGE_KEY);
    setItems(savedItems || []); // 로컬스토리지에서 아이템을 불러와 상태로 설정
  };

  // 선택 종목에서 종목 삭제하는 함수
  const removeStockItem = (stockCode) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.code !== stockCode);
      return newItems;
    });
  };

  return (
    <section className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>
          선택한 종목 <span className={classes.counts}>{items.length}개</span>
        </h2>
        <div className={classes.actions}>
          <span className={classes.action} onClick={toggleEditMode}>
            {isEditMode ? '완료' : '편집'}
          </span>
          <span className={classes.action} onClick={toggleModal}>추가</span>
          <span className={classes.action} onClick={fetchInterestedItems}>불러오기</span> {/* 불러오기 버튼 추가 */}
        </div>
      </div>

      <div className={classes.scrollContainer}>
        <div className={classes.itemsList}>
          <SelectedStockItems 
            items={items} 
            isEditMode={isEditMode} 
            onRemoveItem={removeStockItem} 
          />
        </div>
      </div>

      {isModalOpen && (
        <StockListModal onClose={toggleModal} />
      )}
    </section>
  );
};

export default SelectedStock;
