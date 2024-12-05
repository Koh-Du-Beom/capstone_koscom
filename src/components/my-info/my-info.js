import useAuthStore from "@/store/authStore";
import InterestedItemsBox from "../interested-items/interested-items-box";
import classes from './my-info.module.css';

export default function MyInfo() {
  const { email } = useAuthStore();

  return (
    <section className={classes.container}>
      <div className={classes.userInfo}>
        <h3 className={classes.subHeading}>내 정보</h3>
        <p><strong>이메일:</strong> {email}</p>
      </div>
      <div className={classes.interestedItemsSection}>
        <h3 className={classes.subHeading}>나의 관심 종목</h3>
        <InterestedItemsBox />
      </div>
    </section>
  );
}
