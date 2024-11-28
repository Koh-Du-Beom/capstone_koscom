'use client';
import React, { useState } from 'react';
import classes from './technical-table-identifier.module.css';
import useAuthStore from '@/store/authStore';

export default function TechnicalTableIdentifier({ index, ticker, company_name, exchange_code }) {
  const { email, interestedItems, addInterestedItem, removeInterestedItem } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // 관심 종목 여부 확인
  const isAdded = interestedItems.some((item) => item.code === ticker);

  const handleToggleInterestedItem = async () => {
    setIsLoading(true);

    // marketCategory 설정 로직 추가
    const marketCategory = exchange_code === 'KDQ' ? 'KOSDAQ' : 'KOSPI';

    if (isAdded) {
      // 관심 종목에서 제거
      try {
        const response = await fetch('/api/interestedItems', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: ticker }),
        });

        if (response.ok) {
          removeInterestedItem(ticker); // zustand 상태 업데이트
          alert('관심 종목에서 제거되었습니다.');
        } else {
          const errorData = await response.json();
          alert(errorData.message || '관심 종목 제거에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to delete interested item:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
      }
    } else {
      // 관심 종목에 추가
      try {
        const response = await fetch('/api/interestedItems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: company_name,
            code: ticker,
            marketCategory, // 수정된 부분: exchange_code 대신 marketCategory 사용
          }),
        });

        if (response.ok) {
          addInterestedItem({ name: company_name, code: ticker, marketCategory }); // zustand 상태 업데이트
          alert('관심 종목에 추가되었습니다.');
        } else {
          const errorData = await response.json();
          alert(errorData.message || '관심 종목 추가에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to add interested item:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className={classes.identifierContainer}>
      <span className={classes.index}>{index}</span>
      <div className={classes.infoContainer}>
        <span className={classes.companyName}>{company_name}</span>
      </div>
      <button
        className={`${classes.addButton} ${isAdded ? classes.added : ''}`}
        onClick={handleToggleInterestedItem}
        disabled={isLoading}
      >
        {email && (isAdded ? '★' : '☆')}
      </button>
    </div>
  );
}
