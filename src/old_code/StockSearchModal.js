// src/components/modal/StockSearchModal.js
import React from 'react';
import styles from './StockSearchModal.module.css'; // 경로 수정

const StockSearchModal = ({ closeModal, handleSelectStock }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>종목 검색</h3>
        <div className={styles.stockList}>
          <div className={styles.stockItem} onClick={() => handleSelectStock({ name: '삼성화재', code: '000810' })}>
            <span>삼성화재</span>
            <span>000810</span>
          </div>
          <div className={styles.stockItem} onClick={() => handleSelectStock({ name: '삼성화재우', code: '000815' })}>
            <span>삼성화재우</span>
            <span>000815</span>
          </div>
        </div>
        <button onClick={closeModal} className={styles.closeModalButton}>닫기</button>
      </div>
    </div>
  );
};

export default StockSearchModal;
