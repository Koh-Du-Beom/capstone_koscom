'use client';
import { useState } from 'react';
import classes from './detail-box.module.css';
import DetailToolbar from './detail-toolbar';
import DetailContent from './detail-content';

export default function DetailBox() {
  const [enlarged, setEnlarged] = useState(false);

  const toggleDetail = () => {
    setEnlarged(!enlarged);
  };

  return (
    <div className={classes.container}>
      <DetailToolbar enlarged={enlarged} toggleDetail={toggleDetail} />

      <div
        className={`${classes.contents} ${enlarged ? classes.enlarged : ''}`}
      >
        <DetailContent />
      </div>
    </div>
  );
}
