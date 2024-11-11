import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import InterestedNewsBox from '@/components/interested-news/interested-news-box';
import RecentReportItemBox from '@/components/recent-report/recent-report-box';
import classes from './page.module.css';

export default function Home() {
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
}
