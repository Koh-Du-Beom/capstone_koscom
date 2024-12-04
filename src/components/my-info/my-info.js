import useAuthStore from "@/store/authStore"
import InterestedItemsBox from "../interested-items/interested-items-box"
import classes from './my-info.module.css'

export default function MyInfo(){
  const { email } = useAuthStore();

  return (
    <section className={classes.container}>
      <h2>내 정보</h2>
      <div className={classes.userInfo}>
        
        <p>{email}</p>
      </div>
      <div className={classes.itemsContainer}>
        <InterestedItemsBox />
      </div>
      

    </section>
  )
}