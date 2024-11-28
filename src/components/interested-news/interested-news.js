import React from "react";
import classes from "./interested-news.module.css";

export default function InterestedNews({ news, stockName }) {
  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.container}
    >
      <div className={classes.wrapper}>
        {/* 종목 이름 */}
        <h3 className={classes.stock_name}>[{stockName}]</h3>

        {/* 뉴스 제목 */}
        <p className={classes.title}>{news.title}</p>

        {/* 뉴스 날짜 */}
        <p className={classes.infos}>{news.date}</p>
      </div>
    </a>
  );
}
