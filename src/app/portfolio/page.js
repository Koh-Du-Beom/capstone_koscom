// PortfolioPage.js
'use client'
import React, { useState } from 'react';
import TechnicalFilter from '@/components/technical-analysis/technical-filter/technical-filter';
import TechnicalTable from '@/components/technical-analysis/technical-table/technical-table';
import tableMockData from '@/components/technical-analysis/technical-table/technical-table-mockData';
import TechnicalAnalysisModal from '@/components/modal/technical-analysis-modal/technical-analysis-modal';

export default function PortfolioPage() {
  const [selectedIndicators, setSelectedIndicators] = useState([
    'Awesome Oscillator',
    'RSI',
    'Stochastic Oscillator',
    'Stochastic RSI',
    'True Strength Index (TSI)',
  ]);

  const [showFilter, setShowFilter] = useState(false); // TechnicalFilter 표시 여부 상태

  return (
    <div>
      <h1>Portfolio Page</h1>
      <button onClick={() => setShowFilter((prev) => !prev)}>
        종목 필터
      </button>

			{showFilter && (
        <TechnicalAnalysisModal onClose={() => setShowFilter(false)}>
          <TechnicalFilter
            selectedIndicators={selectedIndicators}
            setSelectedIndicators={setSelectedIndicators}
          />
        </TechnicalAnalysisModal>
      )}

      {/* 선택된 지표를 TechnicalTable에 전달 */}
      <TechnicalTable data={tableMockData} selectedIndicators={selectedIndicators} />
    </div>
  );
}
