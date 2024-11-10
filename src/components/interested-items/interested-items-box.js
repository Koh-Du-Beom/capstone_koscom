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

  // 클라이언트에서만 실행되도록 설정
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 클라이언트에서만 렌더링되도록 설정
  if (!hasMounted) {
    return null;
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 선택된 종목 데이터를 받아 API 요청을 보내서 상세 데이터를 추가
	const addStockItem = async (stock) => {
		if (interestedItems.find((item) => item.code === stock.code)) {
			return;
		}
	
		try {
			// 새로운 API 요청을 통해 주식 데이터를 가져옴
			const response = await axios.get(`/api/stockList?code=${stock.code}`);
		
			if (response.data && response.data.name) {
				// 관심 종목에 추가
				addInterestedItem(response.data);
				setIsModalOpen(false);
			} else {
				console.error("Invalid data structure:", response.data);
			}
		} catch (error) {
			console.error('Failed to fetch stock data:', error.message);
		}
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
              items={interestedItems}
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
