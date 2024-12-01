import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import InterestedNewsBox from '@/components/interested-news/interested-news-box';
import RecentReportItemBox from '@/components/recent-report/recent-report-box';
import classes from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={classes.container}>
      <Link href={'/'}>로그인하지 않고 사용</Link>
      <Link href={'/auth/login'}>로그인하고 사용</Link>
    </main>
  );
}
