import React from 'react';
import classes from './selected-stock-items.module.css';

const SelectedStockItems = ({ items, isEditMode, onRemoveItem, onSelectStock }) => {
  const handleClick = (item) => {
    onSelectStock(item); // 선택된 종목을 부모 컴포넌트로 전달
  };

  return (
    <div>
      {items.map((item, index) => (
        <div className={classes.container} key={index} onClick={() => handleClick(item)}>
          <div className={classes.name}>
            {item.name} ({item.code})
          </div>
					
          {isEditMode && (
            <button 
              className={classes.deleteButton} 
              onClick={(e) => {
                e.stopPropagation(); // 삭제 버튼 클릭 시 onClick이 트리거되지 않도록 방지
                onRemoveItem(item.code);
              }}
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
