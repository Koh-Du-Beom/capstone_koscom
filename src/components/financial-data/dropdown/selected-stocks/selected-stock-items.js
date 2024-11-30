import React, { useState } from 'react';
import classes from './selected-stock-items.module.css';

const SelectedStockItems = ({ items, onSelectStock, selectedStocks }) => {
  return (
    <div>
      {items.map((item, index) => (
        <div
          className={`${selectedStocks.some((stock) => stock.name === item.name) ? classes.selected : ''} ${classes.container}`}
          key={index}
          onClick={() => onSelectStock(item.name)}
        >
          <div className={classes.name}>
            {item.name} ({item.code})
          </div>

          {/* {isEditMode && (
            <button
              className={classes.deleteButton}
              onClick={(e) => {
                e.stopPropagation(); // 삭제 버튼 클릭 시 부모 onClick 방지
                onRemoveItem(item.code);
              }}
            >
              삭제
            </button>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default SelectedStockItems;
