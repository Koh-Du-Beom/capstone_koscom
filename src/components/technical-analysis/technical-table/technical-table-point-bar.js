// TechnicalPointBar.js

import React from 'react';
import classes from './technical-table-point-bar.module.css';

export default function TechnicalPointBar({ indicator, mainScore, subScore }) {
	
	const getBarColor = (index) => {
    if (index < 2) return classes.low;       // 0-20
    if (index < 4) return classes.lowMedium; // 20-40
    if (index < 6) return classes.medium;    // 40-60
    if (index < 8) return classes.mediumHigh; // 60-80
    return classes.high;                     // 80-100
  };

  const filledBars = Math.floor(mainScore / 10); // mainScore에 따라 채워지는 칸의 수 계산

  return (
    <div className={classes.container}>
      <div className={classes.scoreContainer}>
        <span className={classes.mainScore}>{Math.round(mainScore)}점</span>
        {/* subScore가 0이 아니거나 indicator가 Rating이 아닐 때만 subScore 표시 */}
        {subScore !== 0 && indicator !== "Rating" && (
          <span className={classes.subScore}>{parseFloat(subScore).toFixed(2)}</span>
        )}
      </div>
      <div className={classes.barContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`${classes.bar} ${index < filledBars ? getBarColor(index) : classes.empty}`}
          />
        ))}
      </div>
    </div>
  );
}
