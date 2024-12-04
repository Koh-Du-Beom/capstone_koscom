import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import InterestedNewsBox from '@/components/interested-news/interested-news-box';
import RecentReportItemBox from '@/components/recent-report/recent-report-box';
import classes from './page.module.css';
import MiniGraph from '@/components/interested-items/mini-stock-graph';
import useHoveredItemStore from '@/store/hoveredItemStore';

export default function MainPage() {
  const { hoveredItem } = useHoveredItemStore();

  return (
    <main className={classes.container}>
      <div className={classes.leftSection}>
        <InterestedItemsBox />
        {hoveredItem && hoveredItem.graphData && (
          <div className={classes.miniGraph}>
            <MiniGraph data={hoveredItem.graphData} />
          </div>
        )}
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
