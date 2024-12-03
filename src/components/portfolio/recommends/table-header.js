import classes from './table-row.module.css'

export default function RecommendTableHeader(){
  return (
    <thead>
      <tr className={classes.tr}>
        <th className={classes.th}>등록한 사람</th>
        <th className={classes.th}>리밸런싱 방법</th>
        <th className={classes.th}>주요 종목</th>
        <th className={classes.th}>수익률</th>
        <th className={classes.th}>추천 수</th>
        <th className={classes.th}></th>
      </tr>
    </thead>
  )
}