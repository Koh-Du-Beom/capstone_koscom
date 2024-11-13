'use client';
import React, { useState, useEffect, useCallback } from 'react';
import SelectedStockItems from './selected-stock-items';
import SimpleStockListModal from '../modal/stock-list-modal/stock-list-modal';
import classes from './selected-stock.module.css'; // 스타일 모듈
import { getLocalStorageItems } from '@/utils/localStorage'; // 로컬스토리지에서 아이템을 가져오는 함수

const LOCAL_STORAGE_KEY = 'interestedItems'; // InterestedItems의 로컬스토리지 키

const SelectedStock = ({ onSelectStock }) => {
  const [items, setItems] = useState([]); // 선택된 종목 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 관심종목 불러오기 함수
  const fetchInterestedItems = () => {
    const savedItems = getLocalStorageItems(LOCAL_STORAGE_KEY);
    setItems(savedItems || []); // 로컬스토리지에서 아이템을 불러와 상태로 설정
  };

  // 종목 선택 핸들러
  const handleSelectStock = useCallback(() => {
    const selectedNames = items.map((item) => item.name); 
    onSelectStock(selectedNames);
  }, [items, onSelectStock]); 

  // useEffect를 통해 items 변경 시 handleSelectStock 호출
  useEffect(() => {
    if (items.length > 0) {
      handleSelectStock(); // 종목이 변경될 때만 실행
    }
  }, [items]);

  // 선택 종목에서 종목 삭제하는 함수
  const removeStockItem = (stockCode) => {
    setItems((prevItems) => prevItems.filter((item) => item.code !== stockCode));
  };

  // 모달에서 종목을 추가하는 함수
  const addStockItem = (newItem) => {
    setItems((prevItems) => {
      // 이미 있는 종목이 아니면 추가
      if (!prevItems.some((item) => item.code === newItem.code)) {
        return [...prevItems, newItem];
      }
      return prevItems; // 이미 있는 종목이면 그대로 반환
    });
    toggleModal(); // 모달 닫기
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
          <span className={classes.action} onClick={fetchInterestedItems}>관심종목 불러오기</span>
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
        <SimpleStockListModal onClose={toggleModal} onAddItem={addStockItem} /> 
      )}
    </section>
  );
};

export default SelectedStock;
