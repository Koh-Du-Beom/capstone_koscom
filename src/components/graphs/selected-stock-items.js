import React from 'react';
import classes from './selected-stock-items.module.css';

const SelectedStockItems = ({ items, isEditMode, onRemoveItem }) => {
  return (
    <div>
      {items.map((item, index) => (
        <div className={classes.container} key={index}>
          <div className={classes.name}>
            {item.name} ({item.code})
          </div>

          {/* 편집 모드에서만 삭제 버튼 표시 */}
          {isEditMode && (
            <button 
              className={classes.deleteButton} 
              onClick={() => onRemoveItem(item.code)}
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectedStockItems;
