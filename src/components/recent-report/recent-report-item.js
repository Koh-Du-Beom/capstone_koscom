import React from 'react';
import classes from './recent-report-item.module.css';
import { FaFilePdf } from 'react-icons/fa';

function ReportItem({ report }) {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h3 className={classes.title}>{report.title}</h3>
        <p className={classes.organization}>발행 기관: {report.organization}</p>
        <p className={classes.date}>날짜: {report.date}</p>
        <p className={classes.targetPrice}>목표가: {report.targetPrice}원</p>
        <p className={classes.opinion}>투자의견: {report.opinion}</p>
      </div>
      <a href={report.fileLink} target="_blank" rel="noopener noreferrer" className={classes.button}>
        <FaFilePdf className={classes.icon} />
        <span className={classes.tooltip}>보고서 자세히보기</span>
      </a>
    </div>
  );
}

export default ReportItem;
