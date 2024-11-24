import React, { useState, useRef } from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';
import Image from 'next/image';
import { FixedSizeList as List } from 'react-window';
import TableTooltip from './table-tooltip';

export default function TechnicalTable({ data }) {
  const [sortConfig, setSortConfig] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState(null);

  if (!data || !data.items) {
    return <div>데이터가 없습니다.</div>;
  }

  // 헤더 데이터 생성 (ticker와 companyName 제외)
  let headers = Object.keys(data.items[0]).filter(
    (key) =>
      key !== 'ticker' &&
      key !== 'companyName' &&
      key !== 'exchange_code' &&
      key !== 'Rating'
  );

  // 'Rating'을 첫 번째로 배치
  headers = ['Rating', ...headers];

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

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...data.items];

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
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
      });
    }
    return sortableItems;
  }, [data.items, sortConfig]);

  // 행 렌더링 함수
  const Row = ({ index, style }) => {
    const item = sortedItems[index];
    return (
      <div className={classes.row} style={style}>
        <div className={classes.cell}>
          <TechnicalTableIdentifier
            index={index + 1}
            company_name={item.companyName}
            exchange_code={item.exchange_code || '-'}
          />
        </div>
        {headers.map((header) => {
          const value = item[header];
          const isSortedColumn = sortConfig && sortConfig.key === header;
          return (
            <div
              key={`data-${header}`}
              className={`${classes.cell} ${
                isSortedColumn ? classes.sortedCell : ''
              }`}
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

  return (
    <>
      {data.date && (
        <div className={classes.dateContainer}>
          <strong>데이터 기준 날짜:</strong> {data.date}
        </div>
      )}
      <div className={classes.tableContainer}>
        <div className={classes.headerRow}>
          <div className={classes.headerCell}>종목명</div>
          {headers.map((header, index) => {
            const isSortedColumn = sortConfig && sortConfig.key === header;
            const headerName =
              header === 'Rating' ? 'Rating' : header.replace('score_', '');

            // 헤더 셀의 ref 생성
            const headerRef = useRef(null);

            return (
              <div
                key={`header-${index}`}
                className={`${classes.headerCell} ${classes.sortableHeader} ${
                  isSortedColumn ? classes.sortedHeader : ''
                }`}
                ref={headerRef}
                onMouseEnter={() => {
                  if (headerRef.current) {
                    const rect = headerRef.current.getBoundingClientRect();
                    setTooltipPosition({
                      top: rect.top + window.scrollY,
                      left: rect.left + window.scrollX + rect.width / 2,
                    });
                    setTooltipContent(headerName);
                  }
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
          height={600}
          itemCount={sortedItems.length}
          itemSize={50}
          width="100%"
        >
          {Row}
        </List>
      </div>
      {/* 툴팁 렌더링 */}
      {tooltipContent && tooltipPosition && (
        <TableTooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </>
  );
}
