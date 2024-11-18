import React from 'react';
import TechnicalPointBar from './technical-table-point-bar';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';

export default function TechnicalTable({ data, selectedIndicators }) {
  const MAX_COLUMNS = 6; // 최대 칼럼 개수 (종목명, Rating 포함)

  // 기본 칼럼(종목명, Rating) + 선택된 필터
  const visibleIndicators = [...selectedIndicators];
  const additionalEmptyColumns = MAX_COLUMNS - 2 - visibleIndicators.length;

  return (
    <div className={classes.tableContainer}>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>종목명</th>
            <th>Rating</th>
            {visibleIndicators.map((indicator, index) => (
              <th key={`indicator-${index}`}>{indicator}</th>
            ))}
            {/* 빈 칼럼을 추가 */}
            {Array.from({ length: additionalEmptyColumns }).map((_, index) => (
              <th key={`empty-${index}`}></th>
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
                  company_name={item.company_name}
                  exchange_code={item.exchange_code}
                />
              </td>
              {/* 두 번째 칼럼: Rating */}
              <td>
                <TechnicalPointBar
                  indicator="Rating"
                  mainScore={Math.round(item.ranking) || 0}
                  subScore={0}
                />
              </td>
              {/* 선택된 지표 데이터 */}
              {visibleIndicators.map((indicator) => {
                const mainScore = item[`score_${indicator}`];
                const subScore = item[indicator];

                return (
                  <td key={indicator}>
                    <TechnicalPointBar
                      indicator={indicator}
                      mainScore={mainScore !== undefined ? mainScore : 0}
                      subScore={subScore !== undefined ? subScore : 0}
                    />
                  </td>
                );
              })}
              {/* 빈 칼럼 데이터 */}
              {Array.from({ length: additionalEmptyColumns }).map((_, index) => (
                <td key={`empty-data-${index}`}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
