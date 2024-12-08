import classes from './table-row.module.css'

export default function RecommendTableHeader(){
  return (
    <thead>
      <tr className={classes.tr}>
        <th className={classes.th}>포트폴리오 이름</th>
        <th className={classes.th}>등록한 사람</th>
        <th className={classes.th}>주요 종목</th>
        <th className={classes.th}>투자 기간</th>
        <th className={classes.th}>수익률</th>
        <th className={classes.th}>샤프비율</th>
        <th className={classes.th}>MDD</th>
        <th className={classes.th}></th>
      </tr>
    </thead>
  )
}