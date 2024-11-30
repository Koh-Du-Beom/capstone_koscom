// app/page.jsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import InterestedNewsBox from '@/components/interested-news/interested-news-box';
import RecentReportItemBox from '@/components/recent-report/recent-report-box';
import classes from './page.module.css';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const COOKIE_NAME = process.env.COOKIE_NAME;

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    redirect('/auth/login');
  } else {
    try {
      // 토큰 검증
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

      // 토큰이 유효하면 페이지 렌더링
      return (
        <main className={classes.container}>
          <div className={classes.leftSection}>
            <InterestedItemsBox />
          </div>

          <div className={classes.middleSection}>
            <InterestedNewsBox />
          </div>

          <div className={classes.rightSection}>
            <RecentReportItemBox />
          </div>
        </main>
      );
    } catch (error) {
      // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
      redirect('/auth/login');
    }
  }
}
