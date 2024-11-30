'use client';
import React, { useState, useEffect } from 'react';
import SelectedStockItems from './selected-stock-items';
import SimpleStockListModal from '../../../modal/stock-list-modal/stock-list-modal';
import classes from './selected-stock.module.css';
import useAuthStore from '@/store/authStore'; // zustand에서 email 가져오기

const SelectedStock = ({ onSelectStock }) => {
  const { email } = useAuthStore(); // 로그인된 사용자의 email
  const [items, setItems] = useState([]); // 전체 종목 목록
  const [selectedStocks, setSelectedStocks] = useState([]); // 선택된 종목 목록
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // const toggleEditMode = () => {
  //   setIsEditMode(!isEditMode);
  // };

  // 관심종목 불러오기 (API 호출)
  const fetchInterestedItems = async () => {
    if (!email) return;

    try {
      const response = await fetch(`/api/interestedItems?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch interested items');
      }
      const { items: fetchedItems } = await response.json();
      setItems(fetchedItems || []);
    } catch (error) {
      console.error('Error fetching interested items:', error);
    }
  };

  // 선택된 주식 데이터 요청
  const fetchGraphData = async () => {
    const selectedStockNames = selectedStocks.map((item) => item.name);

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
      onSelectStock(graphData); // 그래프 데이터 전달
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
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

  const removeStockItem = (stockCode) => {
    setItems((prevItems) => prevItems.filter((item) => item.code !== stockCode));
  };

  const handleSelectStock = (stockName) => {
    setSelectedStocks((prev) => {
      // 이미 선택된 종목인지 확인
      if (prev.some((stock) => stock.name === stockName)) {
        // 이미 선택된 종목이면 선택 해제
        return prev.filter((stock) => stock.name !== stockName);
      }
      // 새로운 종목 추가
      const selectedItem = items.find((item) => item.name === stockName);
      return [...prev, selectedItem];
    });
  };
  

  useEffect(() => {
    // 초기 렌더링 시 관심종목 불러오기
    fetchInterestedItems();
  }, [email]);

  useEffect(() => {
    if (selectedStocks.length > 0) {
      fetchGraphData();
    }
  }, [selectedStocks]);

  return (
    <section className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>
          분석 대상 종목 <span className={classes.counts}>{selectedStocks.length}개</span>
        </h2>
        <div className={classes.actions}>
          {/* <span className={classes.action} onClick={toggleEditMode}>
            {isEditMode ? '완료' : '편집'}
          </span> */}
          <span className={classes.action} onClick={toggleModal}>종목추가</span>
        </div>
      </div>

      <div className={classes.scrollContainer}>
        <div className={classes.itemsList}>
          <SelectedStockItems
            items={items}
            isEditMode={isEditMode}
            onRemoveItem={removeStockItem}
            onSelectStock={handleSelectStock} // 선택/해제 핸들러 전달
            selectedStocks={selectedStocks} // 선택된 종목 목록 전달
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
