import RecommendTableHeader from "./table-header";
import RecommendTableRow from "./table-row";
import classes from './recommend-table.module.css'

export default function PortfolioRecommendTable({ data }){
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>포트폴리오 Top 랭킹</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <RecommendTableHeader />
        <tbody>
          {data.map((row, index) => (
            <RecommendTableRow
              key={index}
              portfolio_name={row.portfolio_name}
              email={row.email}
              mainStocks={row.mainStocks}
              period={row.period}
              rateReturns={row.rateReturns}
              sharpeRatio={row.sharpeRatio}
              mdd={row.mdd}
              scraps={row.scraps}
            />
          ))}
        </tbody>
      </table>

    </div>

  )
}