'use client';
import React, { useState } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table';
import tableMockData from '@/components/technical-analysis/technical-table/technical-table-mockData';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import classes from './page.module.css'; // 스타일 파일

export default function StockFilterPage() {
  const [selectedIndicators, setSelectedIndicators] = useState([
    'Awesome Oscillator',
    'RSI',
    'Stochastic Oscillator',
    'Stochastic RSI',
    'True Strength Index (TSI)',
  ]);

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <h2 className={classes.title}>종목 및 필터 설정</h2>
        <InterestedItemsBox />
        <TechnicalFilter
          selectedIndicators={selectedIndicators}
          setSelectedIndicators={setSelectedIndicators}
        />
      </div>
      <div className={classes.rightSection}>
        <TechnicalTable data={tableMockData} selectedIndicators={selectedIndicators} />
      </div>
    </div>
  );
}
