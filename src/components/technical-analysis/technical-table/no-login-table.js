import React, { useState, useRef } from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';
import Image from 'next/image';
import { FixedSizeList as List } from 'react-window';
import TableTooltip from './table-tooltip';
import TechnicalTableSearch from './technical-table-search';
import StockHeaderCell from './stock-header-cell/stock-header-cell';

export default function NoLoginTechnicalTable({ data }) {
  const [sortConfig, setSortConfig] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const listRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchButtonPosition, setSearchButtonPosition] = useState({ top: 0, left: 0 });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  if (!data || !data.items) {
    return <div>데이터가 없습니다.</div>;
  }

  const originalDataWithIndex = data.items.map((item, index) => ({
    ...item,
    originalIndex: index + 1,
  }));

  let headers = Object.keys(data.items[0]).filter(
    (key) =>
      key !== 'ticker' &&
      key !== 'companyName' &&
      key !== 'exchange_code' &&
      key !== 'Rating'
  );

  headers = ['Rating', ...headers];
  const totalWidth = `${headers.length * 5 + 13}vw`;

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

  const sortedList = React.useMemo(() => {
    let sortableItems = [...originalDataWithIndex];

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

    return sortableItems.map((item, index) => ({
      ...item,
      sortedIndex: index + 1,
    }));
  }, [originalDataWithIndex, sortConfig]);

  const Row = ({ index, style }) => {
    const item = sortedList[index];

    return (
      <div
        className={`${classes.row} ${
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
              } ${isRatingColumn ? classes.highlightedColumn : ''}`}
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

  const handleSearch = (searchQuery) => {
    const query = searchQuery.toLowerCase();
    const matchingIndexes = sortedList
      .map((item, index) =>
        item.companyName.toLowerCase().includes(query) ? index : -1
      )
      .filter((index) => index !== -1);

    if (matchingIndexes.length === 1) {
      listRef.current.scrollToItem(matchingIndexes[0], 'center');
      setSelectedRow(matchingIndexes[0]);
      setIsSearchOpen(false);
    } else if (matchingIndexes.length > 1) {
      const matchingItems = matchingIndexes.map((index) => sortedList[index]);
      setSearchResults(matchingItems);
      setIsSearchOpen(true);
    } else {
      alert('해당 종목을 찾을 수 없습니다.');
    }
  };

  const selectSearchResult = (result) => {
    const index = sortedList.findIndex(
      (i) => i.companyName === result.companyName
    );
    listRef.current.scrollToItem(index, 'center');
    setSelectedRow(index);
    setIsSearchOpen(false);
    setSearchResults([]);
  };

  return (
    <>
      {data.date && (
        <div className={classes.dateContainer}>
          <strong>데이터 기준일 : </strong> {data.date}
        </div>
      )}
      <div className={classes.tableContainer}>
        <div className={classes.tableScrollContainer}>
          <div
            className={classes.headerRow}
            style={{ width: totalWidth }}
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
                  } ${header === 'Rating' ? classes.highlightedColumn : ''}`}
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
            itemCount={sortedList.length}
            itemSize={50}
            width={totalWidth}
            style={{ overflowX: 'hidden', overflowY: 'auto' }}
            ref={listRef}
          >
            {({ index, style }) => <Row index={index} style={style} />}
          </List>
        </div>
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
      {tooltipContent && tooltipPosition && (
        <TableTooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </>
  );
}
