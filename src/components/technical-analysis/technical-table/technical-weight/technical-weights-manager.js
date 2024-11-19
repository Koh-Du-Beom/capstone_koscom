'use client';
import { useState, useEffect } from 'react';
import classes from './technical-weights-manager.module.css';

export default function TechnicalWeightsManager({ selectedIndicators, updateWeights }) {
  const [indicatorWeights, setIndicatorWeights] = useState({});
  const [checkedIndicators, setCheckedIndicators] = useState([]);
  const [weightError, setWeightError] = useState('');

  const checkTotalWeight = () => {
    const totalWeight = Object.values(indicatorWeights).reduce(
      (sum, weight) => sum + Number(weight || 0),
      0
    );
    if (checkedIndicators.length >= 1 && totalWeight !== 100) {
      setWeightError('가중치의 합이 100%가 되어야 합니다.');
    } else {
      setWeightError('');
    }
  };

  useEffect(() => {
    checkTotalWeight();
  }, [indicatorWeights, checkedIndicators]);

  const handleCheckboxChange = (indicator) => {
    if (checkedIndicators.includes(indicator)) {
      setCheckedIndicators((prev) =>
        prev.filter((item) => item !== indicator)
      );
      setIndicatorWeights((prevWeights) => {
        const updatedWeights = { ...prevWeights };
        delete updatedWeights[indicator];
        return updatedWeights;
      });
    } else {
      setCheckedIndicators((prev) => [...prev, indicator]);
      setIndicatorWeights((prevWeights) => ({
        ...prevWeights,
        [indicator]: '',
      }));
    }
  };

  const handleWeightChange = (indicator, event) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setIndicatorWeights((prevWeights) => ({
        ...prevWeights,
        [indicator]: value,
      }));
    } else {
      setWeightError('숫자를 입력해주세요.');
    }
  };

  const handleApplyWeights = () => {
    if (weightError) {
      alert('가중치의 합이 100%가 되어야 합니다.');
      return;
    }
    const weights = {};
    checkedIndicators.forEach((indicator) => {
      weights[indicator] = Number(indicatorWeights[indicator] || 0);
    });
    updateWeights(weights);
    alert('가중치가 적용되었습니다.');
  };

  return (
    <div className={classes.assetContainer}>
      <div className={classes.stockListContainer}>
        {selectedIndicators.length > 0 &&
          selectedIndicators.map((indicator) => (
            <div key={indicator} className={classes.stockItem}>
              <div className={classes.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={checkedIndicators.includes(indicator)}
                  onChange={() => handleCheckboxChange(indicator)}
                  className={classes.checkbox}
                />
                <label className={classes.indicatorLabel}>{indicator}</label>
              </div>
              <div className={classes.inputContainer}>
                <input
                  type="text"
                  value={indicatorWeights[indicator] || ''}
                  onChange={(event) => handleWeightChange(indicator, event)}
                  placeholder="가중치 (%)"
                  className={classes.ratioInput}
                  disabled={!checkedIndicators.includes(indicator)}
                />
              </div>
            </div>
          ))}
      </div>

      <p className={classes.error}>{weightError}</p>

      <button
        type="button"
        onClick={handleApplyWeights}
        className={classes.applyButton}
        disabled={weightError !== '' || checkedIndicators.length === 0}
      >
        가중치 적용
      </button>
    </div>
  );
}
