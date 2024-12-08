import { useState } from 'react';
import classes from './detail-box.module.css';
import DetailToolbar from './detail-toolbar';
import DetailContent from './detail-content';

export default function DetailBox({ data, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetail = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteSuccess = () => {
    if (onDelete) {
      onDelete(data.id); // 삭제된 포트폴리오의 ID를 부모 컴포넌트에 전달
    }
  };

  return (
    <div className={classes.container}>
      <DetailToolbar
        title={data.portfolio_title}
        isExpanded={isExpanded}
        toggleDetail={toggleDetail}
        onDeleteSuccess={handleDeleteSuccess} // 삭제 성공 콜백 전달
      />

      <div
        className={`${classes.contents} ${isExpanded ? classes.expanded : ''}`}
      >
        <DetailContent data={data} /> {/* 포트폴리오 데이터 전달 */}
      </div>
    </div>
  );
}
