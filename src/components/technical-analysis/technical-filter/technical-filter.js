// IndicatorFilterTable.js
'use client'
import React from 'react';
import classes from './technical-filter.module.css';

export default function TechnicalFilter({ selectedIndicators, setSelectedIndicators }) {
  const indicators = [
    'Awesome Oscillator',
    'RSI',
    'Stochastic Oscillator',
    'Stochastic RSI',
    'True Strength Index (TSI)',
    'Ultimate Oscillator',
    'Williams %R'
  ];

  const handleCheckboxChange = (indicator) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator)
        ? prev.filter((i) => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className={classes.filterContainer}>
      <h3>Momentum</h3>
      <div className={classes.table}>
        {indicators.map((indicator) => (
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
              
              <input
                type="text"
                className={classes.textInput}
                placeholder="직접입력"
                disabled={!selectedIndicators.includes(indicator)}
              />
							<select
                className={classes.select}
                disabled={!selectedIndicators.includes(indicator)}
              >
                <option value="상향돌파">상향돌파</option>
                <option value="하향돌파">하향돌파</option>
              </select>
							<input
                type="text"
                className={classes.textInput}
                placeholder="직접입력"
                disabled={!selectedIndicators.includes(indicator)}
              />
              <input
                type="text"
                className={classes.numberInput}
                placeholder="0"
                disabled={!selectedIndicators.includes(indicator)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
