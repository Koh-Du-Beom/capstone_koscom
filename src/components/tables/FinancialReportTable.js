import styles from './FinancialReportTable.module.css';
import { financialData } from './tableData'; // 테이블 데이터
import FinancialReportTableGraph from '@/components/graphs/FinancialReportTableGraph'; // 새로운 그래프 컴포넌트 import
import { newChartData } from '@/components/graphs/FinancialReportTableGraphData'; // 새로운 그래프 데이터 가져오기

export default function FinancialReportTable() {
  const { labels, rows } = financialData;

  // 금액 포맷 함수 (₩ 기호, 세 자리마다 콤마)
  const formatCurrency = (value) => {
    return `₩${value.toLocaleString('ko-KR')}`;
  };

  // 퍼센트 포맷 함수 (소수점 2자리, % 기호 추가)
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className={styles.container}>
      {/* 연도별 자산현황 텍스트와 차트 */}
      <h2 className={styles.heading2}>연도별 자산현황</h2>
      <FinancialReportTableGraph chartData={newChartData} /> {/* 차트 */}

      {/* 백테스트 요약 보고서 텍스트 */}
      <h3 className={styles.heading3}>백테스트 요약 보고서</h3>

      {/* 테이블 */}
      <table className={styles.reportTable}>
        <thead>
          <tr>
            <th>자산</th>
            {labels.map((label, index) => (
              <th key={index}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.label}</td>
              {row.data.map((value, dataIndex) => (
                <td key={dataIndex}>
                  {dataIndex === 0 ? formatCurrency(value) : formatPercentage(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
