import React from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';

export default function TechnicalTable({ data }) {
  if (!data || !data.items) {
    return <div>데이터가 없습니다.</div>;
  }

  // 헤더 데이터 생성 (ticker와 companyName 제외)
  const headers = Object.keys(data.items[0]).filter(
    (key) => key !== 'ticker' && key !== 'companyName'
  );

  return (
    <>
      {/* 데이터 기준 날짜를 테이블 컨테이너 밖에 배치 */}
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
              {headers.map((header, index) => (
                <th key={`header-${index}`}>
                  {header.replace('score_', '') /* score_ 제거 */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.ticker}>
                {/* 첫 번째 칼럼: 종목명 */}
                <td>
                  <TechnicalTableIdentifier
                    index={index + 1}
                    ticker={item.ticker}
                    company_name={item.companyName}
                    exchange_code={item.exchangeCode || '-'}
                  />
                </td>
                {/* 두 번쨰 칼럼은 전체점수 반영 */}

                {/* 동적으로 생성된 헤더 데이터 렌더링 */}
                {headers.map((header) => {
                  const value = item[header];
                  return (
                    <td key={`data-${header}`}>
                      {value !== undefined ? (
                        <TableCircularProgressBar point={value} />
                      ) : (
                        '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
