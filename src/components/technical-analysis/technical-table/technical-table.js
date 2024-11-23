import React, { useState } from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';
import Image from 'next/image';

export default function TechnicalTable({ data }) {
  const [sortConfig, setSortConfig] = useState(null);

  if (!data || !data.items) {
    return <div>데이터가 없습니다.</div>;
  }

  // 헤더 데이터 생성 (ticker와 companyName 제외)
  const headers = Object.keys(data.items[0]).filter(
    (key) =>
      key !== 'ticker' &&
      key !== 'companyName' &&
      key !== 'exchange_code'
  );

  const handleSort = (header) => {
    let direction = 'descending';
    if (sortConfig && sortConfig.key === header && sortConfig.direction === 'descending') {
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

  return (
    <>
      {data.date && (
        <div className={classes.dateContainer}>
          <strong>데이터 기준 날짜:</strong> {data.date}
        </div>
      )}
      <div className={classes.tableContainer}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>종목명</th>
              {headers.map((header, index) => {
                const isSortedColumn = sortConfig && sortConfig.key === header;
                return (
                  <th
                    key={`header-${index}`}
                    className={`${classes.sortableHeader} ${isSortedColumn ? classes.sortedHeader : ''}`}
                  >
                    {header === 'Rating' ? 'Rating' : header.replace('score_', '')}
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
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => {
              return (
                <tr key={item.ticker}>
                  <td>
                    <TechnicalTableIdentifier
                      index={index + 1}
                      company_name={item.companyName}
                      exchange_code={item.exchange_code || '-'}
                    />
                  </td>
                  {headers.map((header) => {
                    const value = item[header];
                    const isSortedColumn = sortConfig && sortConfig.key === header;
                    return (
                      <td key={`data-${header}`} className={isSortedColumn ? classes.sortedCell : ''}>
                        {typeof value === 'number' ? (
                          <TableCircularProgressBar point={value} />
                        ) : (
                          value !== undefined ? value : '-'
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
