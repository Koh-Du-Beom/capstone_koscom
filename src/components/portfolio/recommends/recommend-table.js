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
              email={row.email}
              rebalMethod={row.rebalMethod}
              stocks={row.stocks}
              rateReturns={row.rateReturns}
              recommends={row.recommends}
            />
          ))}
        </tbody>
      </table>

    </div>

  )
}