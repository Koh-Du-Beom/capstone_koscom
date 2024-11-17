'use client';
import React from 'react';
import classes from './technical-filter.module.css';

export default function TechnicalFilter({ selectedIndicators, setSelectedIndicators }) {
  const indicators = {
    Momentum: [
      'Awesome Oscillator',
      'RSI',
      'Stochastic Oscillator',
      'Stochastic RSI',
      'True Strength Index (TSI)',
      'Ultimate Oscillator',
      'Williams %R'
    ],
    Trend: [
      'Commodity Channel Index',
      'EMA 20',
      'EMA 60',
      'EMA 120',
      'EMA 250',
      'MACD',
      'PSAR',
      'SMA 20',
      'SMA 60',
      'SMA 120',
      'SMA 250',
      'Triple Exponential Averages'
    ],
    Volume: [
      'Accumulation/Distribution Index',
      'Chaikin Money Flow',
      'On-Balance Volume',
      'Price Volume Trend'
    ],
    Volatility: [
      'Bollinger Band',
      'Donchian Channel',
      'Keltner Channel'
    ]
  };

  const handleCheckboxChange = (indicator) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator)
        ? prev.filter((i) => i !== indicator)
        : [...prev, indicator]
    );
  };

  const applyFilter = () => {
    console.log('필터 적용:', selectedIndicators);
  };

  return (
    <div className={classes.filterContainer}>
      {/* 상단 타이틀과 버튼 */}
      <div className={classes.titleContainer}>
        <h2 className={classes.mainTitle}>종목 필터</h2>
        <div className={classes.actionButtons}>
          <button
            className={classes.applyFilterButton}
            onClick={applyFilter}
          >
            필터 적용
          </button>
        </div>
      </div>
      
      {/* 지표 목록 */}
      {Object.entries(indicators).map(([section, items]) => (
        <div key={section} className={classes.section}>
          <div className={classes.header}>
            <h3 className={classes.title}>{section}</h3>
          </div>
          <div className={classes.table}>
            {items.map((indicator) => (
              <div key={indicator} className={classes.row}>
                <div className={classes.checkboxContainer}>
                  <input
                    type="checkbox"
                    className={classes.checkbox}
                    checked={selectedIndicators.includes(indicator)}
                    onChange={() => handleCheckboxChange(indicator)}
                  />
                  <label className={classes.indicatorLabel}>{indicator}</label>
                </div>
                <div className={classes.inputContainer}>
                  <select
                    className={classes.select}
                    disabled={!selectedIndicators.includes(indicator)}
                  >
                    <option value="상향돌파">상향돌파</option>
                    <option value="하향돌파">하향돌파</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
