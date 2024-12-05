import Image from 'next/image'
import classes from './table-row.module.css'

export default function RecommendTableRow({ email, rebalMethod, stocks, rateReturns, recommends }){
  return (
    <tr className={classes.tr}>
      <td className={classes.td}>{email}</td>
      <td className={classes.td}>{rebalMethod}</td>
      <td className={classes.td}>{stocks}</td>
      <td className={classes.td}>{rateReturns}</td>
      <td className={classes.td}>
        {recommends}
        <button className={classes.recommendButton}>
          <Image 
            src={'/svgs/recommend.svg'}
            alt='recommendButton'
            width={16}
            height={16}
          />
        </button>
      </td>
      <td><button className={classes.detailButton}>자세히보기</button></td>
    </tr>
  )
}