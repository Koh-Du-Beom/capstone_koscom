import React, { useEffect } from 'react';
import classes from './stock-header-cell.module.css';

export default function StockHeaderCell({ setSearchButtonPosition, setIsSearchOpen }) {
  return (
    <div
      className={classes.stockHeaderCell}
      ref={(el) => {
        if (el && !setSearchButtonPosition) {
          const rect = el.getBoundingClientRect();
          setSearchButtonPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX + rect.width / 2,
          });
        }
      }}
    >
      <span>종목명</span>
      <button
        className={classes.searchButton}
        onClick={(e) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          setIsSearchOpen(true); // 검색창 열기
        }}
      >
        🔍
      </button>
    </div>
  );
}
