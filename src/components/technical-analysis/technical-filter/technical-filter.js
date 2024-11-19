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
      'Williams %R',
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
      'Triple Exponential Averages',
    ],
    Volume: [
      'Accumulation/Distribution Index',
      'Chaikin Money Flow',
      'On-Balance Volume',
      'Price Volume Trend',
    ],
    Volatility: ['Bollinger Band', 'Donchian Channel', 'Keltner Channel'],
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (indicator) => {
    setSelectedIndicators((prev) => {
      const newSelected = { ...prev };
      if (newSelected[indicator]) {
        // 이미 선택되어 있으면 제거
        delete newSelected[indicator];
      } else {
        // 선택되지 않았으면 기본값으로 추가
        newSelected[indicator] = '상향돌파';
      }
      return newSelected;
    });
  };

  // 셀렉트 박스 변경 핸들러
  const handleSelectChange = (indicator, value) => {
    setSelectedIndicators((prev) => ({
      ...prev,
      [indicator]: value,
    }));
  };

  return (
    <div className={classes.filterContainer}>
      <div className={classes.titleContainer}>
        <h1 className={classes.mainTitle}>종목 필터</h1>
      </div>

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
                    checked={selectedIndicators.hasOwnProperty(indicator)}
                    onChange={() => handleCheckboxChange(indicator)}
                  />
                  <label className={classes.indicatorLabel}>{indicator}</label>
                </div>
                <div className={classes.inputContainer}>
                  <select
                    className={classes.select}
                    disabled={!selectedIndicators.hasOwnProperty(indicator)}
                    value={selectedIndicators[indicator] || '상향돌파'}
                    onChange={(e) => handleSelectChange(indicator, e.target.value)}
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
