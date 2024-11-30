import React, { useState, useRef, useEffect } from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';
import Image from 'next/image';
import { FixedSizeList as List } from 'react-window';
import TableTooltip from './table-tooltip';
import TechnicalTableSearch from './technical-table-search';
import useAuthStore from '@/store/authStore';
import StockHeaderCell from './stock-header-cell/stock-header-cell';

export default function TechnicalTable({ data }) {
  const [sortConfig, setSortConfig] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [applyInterestedSort, setApplyInterestedSort] = useState(false); // 관심 종목 정렬 활성화 여부

  const listRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchButtonPosition, setSearchButtonPosition] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const { interestedItems, fetchInterestedItems } = useAuthStore();

  // 관심 종목이 없으면 가져오기
  useEffect(() => {
    if (interestedItems.length === 0) {
      fetchInterestedItems();
    }
  }, [interestedItems.length, fetchInterestedItems]);

  if (!data || !data.items) {
    return <div>데이터가 없습니다.</div>;
  }

  // 원본 데이터의 인덱스 추가
  const originalDataWithIndex = data.items.map((item, index) => ({
    ...item,
    originalIndex: index + 1, // 1부터 시작
  }));

  // 헤더 데이터 생성
  let headers = Object.keys(data.items[0]).filter(
    (key) =>
      key !== 'ticker' &&
      key !== 'companyName' &&
      key !== 'exchange_code' &&
      key !== 'Rating'
  );

  headers = ['Rating', ...headers];
  const totalWidth = `${headers.length * 5 + 13}vw`;

  const [showInterestedOnly, setShowInterestedOnly] = useState(false);

  const handleSort = (header) => {
    let direction = 'descending';
    if (
      sortConfig &&
      sortConfig.key === header &&
      sortConfig.direction === 'descending'
    ) {
      direction = 'ascending';
    }
    setSortConfig({ key: header, direction });
  };

  // 1. 정렬된 리스트 생성
  const sortedList = React.useMemo(() => {
    let sortableItems = [...originalDataWithIndex];

    // 정렬 적용
    if (sortConfig !== null) {
      const compare = (a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      };

      sortableItems.sort(compare);
    }

    // sortedIndex 부여
    sortableItems = sortableItems.map((item, index) => ({
      ...item,
      sortedIndex: index + 1, // 1부터 시작
    }));

    return sortableItems;
  }, [originalDataWithIndex, sortConfig]);

  // 2. 관심 종목을 최상단에 배치 (버튼 클릭 시 활성화)
  const sortedItems = React.useMemo(() => {
    if (!applyInterestedSort) {
      return sortedList; // 관심 종목 기준 정렬 비활성화
    }

    const interestedTickers = interestedItems.map((item) => item.code);

    // 관심 종목과 일반 종목 분리
    let interestedData = sortedList.filter((item) =>
      interestedTickers.includes(item.ticker)
    );
    let otherData = sortedList.filter(
      (item) => !interestedTickers.includes(item.ticker)
    );

    // 관심 종목을 최상단에 배치
    let combinedItems = [...interestedData, ...otherData];

    // 관심 종목만 보기 설정
    if (showInterestedOnly) {
      combinedItems = interestedData;
    }

    return combinedItems;
  }, [sortedList, interestedItems, showInterestedOnly, applyInterestedSort]);

  // 행 렌더링 함수
  const Row = ({ index, style }) => {
    const item = sortedItems[index];

    const isInterested = interestedItems.some(
      (interestedItem) => interestedItem.code === item.ticker
    );

    return (
      <div
        className={`${isInterested ? classes.interestedRow : classes.row} ${
          index === selectedRow ? classes.highlightedRow : ''
        }`}
        style={{ ...style, width: totalWidth }}
      >
        <div className={classes.cell}>
          <TechnicalTableIdentifier
            index={item.sortedIndex}
            ticker={item.ticker}
            company_name={item.companyName}
            exchange_code={item.exchange_code}
          />
        </div>
        {headers.map((header) => {
          const value = item[header];
          const isSortedColumn = sortConfig && sortConfig.key === header;
          const isRatingColumn = header === 'Rating';

          return (
            <div
              key={`data-${header}-${index}`}
              className={`${classes.cell} ${
                isSortedColumn ? classes.sortedCell : ''
              } ${isRatingColumn ? classes.ratingColumn : ''}`}
            >
              {typeof value === 'number' ? (
                <TableCircularProgressBar point={value} />
              ) : value !== undefined ? (
                value
              ) : (
                '-'
              )}
            </div>
          );
        })}
      </div>
    );
  };




  //종목명 검색 관련

  const handleSearch = (searchQuery) => {
    const query = searchQuery.toLowerCase();
    const matchingIndexes = sortedItems
      .map((item, index) =>
        item.companyName.toLowerCase().includes(query) ? index : -1
      )
      .filter((index) => index !== -1);

    if (matchingIndexes.length === 1) {
      listRef.current.scrollToItem(matchingIndexes[0], 'center');
      console.log(matchingIndexes[0]);

      setSelectedRow(matchingIndexes[0]);
      setIsSearchOpen(false);
    } else if (matchingIndexes.length > 1) {
      const matchingItems = matchingIndexes.map((index) => sortedItems[index]);
      setSearchResults(matchingItems);
      setIsSearchOpen(true);
    } else {
      alert('해당 종목을 찾을 수 없습니다.');
    }
  };

  // 검색 결과 선택 핸들러
  const selectSearchResult = (result) => {
    const index = sortedItems.findIndex(
      (i) => i.companyName === result.companyName
    );
    listRef.current.scrollToItem(index, 'center'); // 리스트 스크롤
    setSelectedRow(index);
    setIsSearchOpen(false); // 검색창 닫기
    setSearchResults([]); // 검색 결과 초기화
  };

  return (
    <>
      {data.date && (
        <div className={classes.dateContainer}>
          {/* 관심 종목 정렬 버튼 */}
          <button
            className={classes.toggleInterestedButton}
            onClick={() => setApplyInterestedSort((prev) => !prev)}
          >
            {applyInterestedSort ? '일반 정렬' : '관심종목 우선 정렬'}
          </button>
          <strong>데이터 기준일 : </strong> {data.date}
        </div>
      )}
      <div className={classes.tableContainer}>
        {/* 스크롤 컨테이너 시작 */}
        <div className={classes.tableScrollContainer}>
          <div
            className={classes.headerRow}
            style={{ width: totalWidth }} // 헤더의 너비 설정
          >
            <StockHeaderCell 
              setSearchButtonPosition={setSearchButtonPosition}
              setIsSearchOpen={setIsSearchOpen}
            />
            {headers.map((header, index) => {
              const isSortedColumn = sortConfig && sortConfig.key === header;
              const headerName =
                header === 'Rating' ? 'Rating' : header.replace('score_', '');

              return (
                <div
                  key={`header-${index}`}
                  className={`${classes.headerCell} ${classes.sortableHeader} ${
                    isSortedColumn ? classes.sortedHeader : ''
                  } ${header === 'Rating' ? classes.ratingColumn : ''}`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPosition({
                      top: rect.top + window.scrollY,
                      left: rect.left + window.scrollX + rect.width / 2,
                    });
                    setTooltipContent(headerName);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                    setTooltipPosition(null);
                  }}
                >
                  {headerName}
                  <span
                    className={classes.sortIcon}
                    onClick={() => handleSort(header)}
                  >
                    <Image
                      src="/svgs/sort.svg"
                      alt="sortIcon"
                      width={16}
                      height={16}
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <List
            className={classes.list}
            height={window.innerHeight * 0.8}
            itemCount={sortedItems.length}
            itemSize={50}
            width={totalWidth}
            style={{ overflowX: 'hidden', overflowY: 'auto' }} // 가로 스크롤 숨김
            ref={listRef}
          >
            {({ index, style }) => <Row index={index} style={style} />}
          </List>
        </div>
        {/* 스크롤 컨테이너 끝 */}
      </div>
      {isSearchOpen && (
        <TechnicalTableSearch
          onSearch={(query) => handleSearch(query)}
          onClose={() => setIsSearchOpen(false)}
          position={searchButtonPosition}
          searchResults={searchResults}
          onResultSelect={(result) => selectSearchResult(result)}
        />
      )}
      {/* 툴팁 렌더링 */}
      {tooltipContent && tooltipPosition && (
        <TableTooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </>
  );
}
