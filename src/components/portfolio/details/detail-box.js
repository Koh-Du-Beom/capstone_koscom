import { useState } from 'react';
import classes from './detail-box.module.css';
import DetailToolbar from './detail-toolbar';
import DetailContent from './detail-content';

export default function DetailBox({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetail = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={classes.container}>
      <DetailToolbar title={data.portfolio_title} isExpanded={isExpanded} toggleDetail={toggleDetail} />

      <div
        className={`${classes.contents} ${isExpanded ? classes.expanded : ''}`}
      >
        <DetailContent data={data} /> {/* 포트폴리오 데이터 전달 */}
      </div>
    </div>
  );
}
