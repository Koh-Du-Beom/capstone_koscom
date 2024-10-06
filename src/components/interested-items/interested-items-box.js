'use client'
import React, { useState } from 'react';
import InterestedItems from './interested-items';
import StockListModal from '../stock-list-modal/stock-list-modal';
import classes from './interested-items-box.module.css';

const InterestedItemsBox = () => {
  const [items, setItems] = useState([]); // 관심 종목 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태

  // 모달 열기/닫기 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 관심 종목에 종목 추가하는 함수
  const addStockItem = (stock) => {
    // 이미 추가된 종목은 중복되지 않도록 필터링
    setItems((prevItems) => {
      if (prevItems.find((item) => item.code === stock.code)) {
        return prevItems; // 중복 종목은 추가하지 않음
      }
      return [...prevItems, stock];
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
          <span className={classes.action}>편집</span>
          <span className={classes.action} onClick={toggleModal}>추가</span>
        </div>
      </div>
      <div className={classes.itemsList}>
        <InterestedItems items={items} />
      </div>

      {isModalOpen && (
        <StockListModal onClose={toggleModal} onAddItem={addStockItem} />
      )}
    </section>
  );
};

export default InterestedItemsBox;
