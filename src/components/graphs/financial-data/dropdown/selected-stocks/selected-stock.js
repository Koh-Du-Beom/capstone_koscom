'use client';
import React, { useState, useEffect } from 'react';
import SelectedStockItems from './selected-stock-items';
import SimpleStockListModal from '../../../../modal/stock-list-modal/stock-list-modal';
import classes from './selected-stock.module.css';
import { getLocalStorageItems } from '@/utils/localStorage';

const LOCAL_STORAGE_KEY = 'interestedItems';

const SelectedStock = ({ onSelectStock }) => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const fetchInterestedItems = () => {
    const savedItems = getLocalStorageItems(LOCAL_STORAGE_KEY);
    setItems(savedItems || []);
  };

  // 선택된 주식 데이터 요청
  const fetchGraphData = async () => {
    const selectedStockNames = items.map((item) => item.name);

    try {
      const response = await fetch('/api/getGraphData-checkBox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedStocks: selectedStockNames }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }

      const graphData = await response.json();
      console.log('Fetched Graph Data:', graphData); // 데이터를 콘솔에 출력
      // onSelectStock(graphData); // 그래프 데이터 전달
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }

    
  };

  const fetchMockGraphData = async () => {
    try {
      const response = await fetch('/api/encode-json');
      if (!response.ok) {
        throw new Error('Failed to fetch fixed data');
      }
      const data = await response.json();
      console.log('Mock Graph Data:', data); // 복원된 데이터를 콘솔에 출력
      onSelectStock(data); // 복원된 데이터를 상위 컴포넌트로 전달
    } catch (error) {
      console.error('Error fetching fixed data:', error);
    }
  };

  const removeStockItem = (stockCode) => {
    setItems((prevItems) => prevItems.filter((item) => item.code !== stockCode));
  };

  const addStockItem = (newItem) => {
    setItems((prevItems) => {
      if (!prevItems.some((item) => item.code === newItem.code)) {
        return [...prevItems, newItem];
      }
      return prevItems;
    });
    toggleModal();
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
          <span className={classes.action} onClick={fetchMockGraphData}>그래프 데이터 요청</span> {/* fetchGraphData를 버튼에 연결 */}
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
