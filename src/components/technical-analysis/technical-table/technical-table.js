import React from 'react';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';
import TableCircularProgressBar from './technical-table-circular-progress-bar';
import Image from 'next/image';

export default function TechnicalTable({ data, indicatorWeights }) {
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
              <th className={classes.ratingHeader}>
                Rating
                <span
                  className={classes.infoIcon}
                  
                >
                  <Image
                    src="/svgs/help.svg" // public 폴더 하위 경로만 입력
                    alt="helpIcon"
                    width={16} // 원하는 너비로 설정
                    height={16} // 원하는 높이로 설정
                  />
                </span>
              </th>
              {headers.map((header, index) => (
                <th key={`header-${index}`}>
                  {header.replace('score_', '') /* score_ 제거 */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => {
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
                      ticker={item.ticker}
                      company_name={item.companyName}
                      exchange_code={item.exchangeCode || '-'}
                    />
                  </td>
                  <td>
                    {formattedScore !== null ? (
                      <TableCircularProgressBar point={parseFloat(formattedScore)} />
                    ) : (
                      '-'
                    )}
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
