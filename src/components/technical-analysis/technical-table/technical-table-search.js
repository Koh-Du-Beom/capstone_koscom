// technical-table-search.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './technical-table-search.module.css';

function TechnicalTableSearch({ onSearch, onClose, position }) {
  const [searchQuery, setSearchQuery] = useState('');

  return ReactDOM.createPortal(
    <div
      className={classes.searchContainer}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, 0)',
      }}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="종목명 검색"
        className={classes.searchInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(searchQuery);
          }
        }}
      />
      <button
        onClick={() => onSearch(searchQuery)}
        className={classes.searchSubmitButton}
      >
        검색
      </button>
      <button onClick={onClose} className={classes.closeButton}>
        닫기
      </button>
    </div>,
    document.body
  );
}

export default TechnicalTableSearch;
