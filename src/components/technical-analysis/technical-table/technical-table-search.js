import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './technical-table-search.module.css';

function TechnicalTableSearch({ onSearch, onClose, position, searchResults, onResultSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!position) return null; // position이 null이면 아무것도 렌더링하지 않음

  return ReactDOM.createPortal(
    <div
      className={classes.searchContainer}
      style={{
        position: 'absolute',
        top: `${position.top + 10}px`, // 10px 아래로 이동
        left: `${position.left}px`, // 정확한 좌표 지정
      }}
    >
			<div className={classes.searchInput}>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="종목명 검색"
					className={classes.searchInput}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							onSearch(searchQuery); // 검색어 전달
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
			</div>
      

      {/* 검색 결과 표시 */}
      {searchResults && searchResults.length > 0 && (
        <ul className={classes.searchResultsList}>
          {searchResults.map((result) => (
            <li
              key={result.ticker}
              onClick={() => {
                onResultSelect(result); // 결과 선택
              }}
              className={classes.searchResultItem}
            >
              {result.companyName} ({result.ticker})
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
}

export default TechnicalTableSearch;
