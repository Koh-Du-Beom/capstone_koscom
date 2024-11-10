// TechnicalTable.js

import React from 'react';
import TechnicalPointBar from './technical-table-point-bar';
import TechnicalTableIdentifier from './technical-table-identifier';
import classes from './technical-table.module.css';

export default function TechnicalTable({ data, selectedIndicators }) {
  return (
    <div className={classes.tableContainer}>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>종목명</th>
            <th>Rating</th>
            {selectedIndicators.map((indicator) => (
              <th key={indicator}>{indicator}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={item.ticker}>
              {/* 첫 번째 칼럼: 종목명, 티커 및 거래소 코드 */}
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

              {/* 동적 지표 칼럼 */}
              {selectedIndicators.map((indicator) => {
                // 그대로 지표 이름을 사용하여 mainScore와 subScore에 접근
                const mainScore = item[`score_${indicator}`];
                const subScore = item[indicator];

                return (
                  <td key={indicator}>
                    <TechnicalPointBar
                      indicator={indicator}
                      mainScore={mainScore !== undefined ? mainScore : 0}  // mainScore가 없을 경우 0으로 설정
                      subScore={subScore !== undefined ? subScore : 0}     // subScore가 없을 경우 0으로 설정
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
