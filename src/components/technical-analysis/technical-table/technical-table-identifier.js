'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import classes from './technical-table-identifier.module.css';
import useAuthStore from '@/store/authStore';

export default function TechnicalTableIdentifier({ index, ticker, company_name, exchange_code }) {
  const { email, addInterestedItem } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToInterestedItems = async () => {
    if (!email) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/interestedItems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: company_name,
          code: ticker,
          marketCategory: exchange_code,
        }),
      });

      if (response.ok) {
        setIsAdded(true); // 관심종목 추가 성공
        addInterestedItem({ name: company_name, code: ticker, marketCategory: exchange_code });
        alert('관심 종목에 추가되었습니다.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || '관심 종목 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to add interested item:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.identifierContainer}>
      <span className={classes.index}>{index}</span>
      <div className={classes.infoContainer}>
        <span className={classes.companyName}>{company_name}</span>
      </div>
      <button
        className={`${classes.addButton} ${isAdded ? classes.added : ''}`}
        onClick={handleAddToInterestedItems}
        disabled={isLoading || isAdded}
      >
        {isAdded ? '★' : '☆'}
      </button>
    </div>
  );
}
