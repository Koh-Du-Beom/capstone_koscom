'use client'
import React, { useEffect, useState } from 'react';
import PortfolioRecommendTable from '@/components/portfolio/recommends/recommend-table';

export default function PortfolioPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // API 호출
    fetch('/api/portfolio/recommends')
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      })
      .catch(() => {
        setError('데이터를 가져오는 중 문제가 발생했습니다.');
      });
  }, []);


  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <PortfolioRecommendTable data={data} />
      )}
    </>
  );
}
