import Image from 'next/image'
import classes from './table-row.module.css'
import { useState } from 'react'
import RecommendModal from './recommend-modal';

export default function RecommendTableRow({ portfolio_name, email, mainStocks, period, rateReturns, sharpeRatio, mdd, scraps }){
  const [showModal, setShowModal] = useState(false);
  
  const toggleModal = () => {
    setShowModal(!showModal);
  }
  return (
    <tr className={classes.tr}>
      <td className={classes.td}>{portfolio_name}</td>
      <td className={classes.td}>{email}</td>
      <td className={classes.td}>{mainStocks}</td>
      <td className={classes.td}>{period}</td>
      <td className={classes.td}>{rateReturns}</td>
      <td className={classes.td}>{sharpeRatio}</td>
      <td className={classes.td}>{mdd}</td>
      
      <td><button className={classes.detailButton} onClick={toggleModal}>자세히보기</button></td>
      {showModal && (
        <RecommendModal portfolio_name={portfolio_name} toggleModal={toggleModal}/>
      )}
    </tr>
  )
}