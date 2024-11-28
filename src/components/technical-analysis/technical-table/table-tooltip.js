// Tooltip.js
import React from 'react';
import ReactDOM from 'react-dom';
import classes from './table-tooltip.module.css';

function TableTooltip({ content, position }) {
  return ReactDOM.createPortal(
    <div
      className={classes.tooltip}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)', // 화살표가 아래쪽에 위치하도록
      }}
    >
      {content == 'Rating' ? 'Rating은 가중치를 고려한 종목들의 환산점수입니다' : content}
      <div className={classes.tooltipArrow} />
    </div>,
    document.body
  );
}

export default TableTooltip;
