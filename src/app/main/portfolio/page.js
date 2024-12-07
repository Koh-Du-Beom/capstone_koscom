'use client'
import React, { useEffect } from 'react';
import PortfolioRecommendTable from '@/components/portfolio/recommends/recommend-table';

export default function PortfolioPage() {
  const data = [
    {
      portfolio_name: "수익률 최강 포트폴리오",
      email: "example@test.com", 
      mainStocks: "삼성전자, SK하이닉스, 카카오", 
      period: "1년", 
      rateReturns: "25.4%",
      sharpeRatio: "1.2",
      mdd: "-10.5%",
      scraps: 123,
    },
    {
      portfolio_name: "안정성 포트폴리오",
      email: "example@test.com",
      mainStocks: "현대차, LG화학, NAVER",
      period: "6개월",
      rateReturns: "12.8%",
      sharpeRatio: "0.9",
      mdd: "-8.3%",
      scraps: 85,
    },
    {
      portfolio_name: "고위험 고수익",
      email: "example@test.com",
      mainStocks: "테슬라, 엔비디아, 애플",
      period: "2년",
      rateReturns: "40.3%",
      sharpeRatio: "1.8",
      mdd: "-15.2%",
      scraps: 210,
    }
  ];


  return (
    <>
      <PortfolioRecommendTable data={data}/>
    
    
    </>
  );
}
