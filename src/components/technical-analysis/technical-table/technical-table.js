import React, { useState } from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';
import Image from 'next/image';

export default function TechnicalTable({ data, indicatorWeights }) {
  const [sortConfig, setSortConfig] = useState(null);

  if (!data || !data.items) {
    return <div>데이터가 없습니다.</div>;
  }

  // 헤더 데이터 생성 (ticker와 companyName 제외)
  const headers = Object.keys(data.items[0]).filter(
    (key) => key !== 'ticker' && key !== 'companyName' && key !== 'exchange_code'
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
        let aValue, bValue;

        if (sortConfig.key === 'Rating') {
          // a와 b의 Rating 값 계산
          const calculateRating = (item) => {
            const scores = headers
              .map((header) => {
                const score = item[header];
                const indicatorName = header.replace('score_', '');
                const weight = indicatorWeights[indicatorName];
                return {
                  score,
                  weight: weight !== undefined ? weight : 0,
                };
              })
              .filter(({ score, weight }) => typeof score === 'number' && weight > 0);

            const totalWeight = scores.reduce((sum, { weight }) => sum + weight, 0);
            const weightedScore =
              totalWeight > 0
                ? scores.reduce((sum, { score, weight }) => sum + score * weight, 0) / totalWeight
                : null;
            return weightedScore;
          };

          aValue = calculateRating(a);
          bValue = calculateRating(b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

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
  }, [data.items, sortConfig, headers, indicatorWeights]);

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
              <th
                className={`${classes.ratingHeader} ${
                  sortConfig && sortConfig.key === 'Rating' ? classes.sortedHeader : ''
                }`}
              >
                Rating
                <span className={classes.infoIcon}>
                  <Image
                    src="/svgs/help.svg"
                    alt="helpIcon"
                    width={16}
                    height={16}
                  />
                </span>
                <span 
                  className={classes.sortIcon}
                  onClick={() => handleSort('Rating')}
                >
                  <Image
                    src="/svgs/sort.svg"
                    alt="sortIcon"
                    width={16}
                    height={16}
                  />
                </span>
              </th>
              {headers.map((header, index) => {
                const isSortedColumn = sortConfig && sortConfig.key === header;
                return (
                  <th
                    key={`header-${index}`}
                    className={`${classes.sortableHeader} ${isSortedColumn ? classes.sortedHeader : ''}`}
                  >
                    {header.replace('score_', '')}
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
              const scores = headers
                .map((header) => {
                  const score = item[header];
                  const indicatorName = header.replace('score_', '');
                  const weight = indicatorWeights[indicatorName];
                  return {
                    score,
                    weight: weight !== undefined ? weight : 0,
                  };
                })
                .filter(({ score, weight }) => typeof score === 'number' && weight > 0);

              const totalWeight = scores.reduce((sum, { weight }) => sum + weight, 0);
              const weightedScore =
                totalWeight > 0
                  ? scores.reduce((sum, { score, weight }) => sum + score * weight, 0) / totalWeight
                  : null;
              const formattedScore = weightedScore !== null ? weightedScore.toFixed(1) : null;

              return (
                <tr key={item.ticker}>
                  <td>
                    <TechnicalTableIdentifier
                      index={index + 1}
                      company_name={item.companyName}
                      exchange_code={item.exchange_code || '-'}
                    />
                  </td>
                  <td className={sortConfig && sortConfig.key === 'Rating' ? classes.sortedCell : ''}>
                    {formattedScore !== null ? (
                      <TableCircularProgressBar point={parseFloat(formattedScore)} />
                    ) : (
                      '-'
                    )}
                  </td>
                  {headers.map((header) => {
                    const value = item[header];
                    const isSortedColumn = sortConfig && sortConfig.key === header;
                    return (
                      <td key={`data-${header}`} className={isSortedColumn ? classes.sortedCell : ''}>
                        {value !== undefined ? (
                          <TableCircularProgressBar point={value} />
                        ) : (
                          '-'
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
