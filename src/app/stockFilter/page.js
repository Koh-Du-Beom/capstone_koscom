// PortfolioPage.js
'use client'
import React, { useState } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table';
import tableMockData from '@/components/technical-analysis/technical-table/technical-table-mockData';
import TechnicalAnalysisModal from '@/components/modal/technical-analysis-modal/technical-analysis-modal';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import classes from './page.module.css'; // 스타일 파일을 추가합니다.

export default function StockFilterPage() {
  const [selectedIndicators, setSelectedIndicators] = useState([
    'Awesome Oscillator',
    'RSI',
    'Stochastic Oscillator',
    'Stochastic RSI',
    'True Strength Index (TSI)',
  ]);

  return (
    <div>
      <div className={classes.filterContainer}>
        <InterestedItemsBox />
        <TechnicalFilter
          selectedIndicators={selectedIndicators}
          setSelectedIndicators={setSelectedIndicators}
        />
      </div>
      <TechnicalTable data={tableMockData} selectedIndicators={selectedIndicators} />
    </div>
  );
}
