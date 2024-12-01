import classes from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={classes.container}>
      <h1 className={classes.title}>SuperFantastic</h1>
      <div className={classes.links}>
        <Link href={'/auth/login'} className={classes.link}>
          로그인하고 사용
        </Link>
        <Link href={'/auth/signup'} className={classes.link}>
          회원가입
        </Link>
        <Link href={'/no-login/stockFilter'} className={classes.link}>
          비회원으로 체험
        </Link>
      </div>
    </main>
  );
}
