'use client';
import React, { useState, useEffect } from 'react';
import InterestedItems from './interested-items';
import SimpleStockListModal from '../modal/simple-stock-list-modal/simple-stock-list-modal';
import classes from './interested-items-box.module.css';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';
import axios from 'axios';

const InterestedItemsBox = () => {
  const { interestedItems, addInterestedItem, removeInterestedItem } = useInterestedItems();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
  const [hasMounted, setHasMounted] = useState(false); // 클라이언트에서만 렌더링되는 상태

  // 가격 정보를 저장할 상태
  const [stockDataList, setStockDataList] = useState([]);

  // 클라이언트에서만 실행되도록 설정
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 관심 종목 목록이 변경될 때마다 가격 정보를 가져오는 함수
  useEffect(() => {
    const fetchStockData = async () => {
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
      }
    };

    fetchStockData();

    // 주기적으로 가격 정보를 업데이트 (1시간마다)
    const interval = setInterval(fetchStockData, 60 * 1000 * 60); // 60,000ms = 1분

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, [interestedItems]);

  if (!hasMounted) {
    return null;
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 선택된 종목 데이터를 받아 관심 목록에 추가
  const addStockItem = (stock) => {
    if (interestedItems.find((item) => item.code === stock.code)) {
      return;
    }

    // 로컬 스토리지에 name, code, marketCategory만 저장
    addInterestedItem({
      name: stock.name,
      code: stock.code,
      marketCategory: stock.marketCategory,
    });

    setIsModalOpen(false);
  };

  // 관심 종목을 종목 코드로 제거하는 함수
  const removeStockItem = (stockCode) => {
    // 관심 목록에서 종목 코드를 찾아 제거
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
              items={stockDataList}
              isEditMode={isEditMode}
              onRemoveItem={removeStockItem}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <SimpleStockListModal onClose={toggleModal} onAddItem={addStockItem} />
      )}
    </section>
  );
};

export default InterestedItemsBox;
