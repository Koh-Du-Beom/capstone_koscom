'use client'
import React, { useEffect } from 'react';
import PortfolioRecommendTable from '@/components/portfolio/recommends/recommend-table';

export default function PortfolioPage() {
  const data = [
    { email: 'user1@example.com', rebalMethod: '지정비중', stocks: '삼성전자, SK하이닉스', rateReturns: '12.5%', recommends: 2048 },
    { email: 'user2@example.com', rebalMethod: '동일비중', stocks: '현대차, LG화학', rateReturns: '8.3%', recommends: 1689 },
    { email: 'user3@example.com', rebalMethod: '절대모멘텀', stocks: '카카오, 네이버', rateReturns: '15.7%', recommends: 1210 },
    { email: 'user4@example.com', rebalMethod: '최소 분산', stocks: '포스코, KT&G', rateReturns: '2.1%', recommends: 231 },
    { email: 'user5@example.com', rebalMethod: '최대 다각화', stocks: '한화, 셀트리온', rateReturns: '5.9%', recommends: 142 },
  ];


  return (
    <>
      <PortfolioRecommendTable data={data}/>
    
    
    </>
  );
}
