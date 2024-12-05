import classes from './detail-content.module.css';

export default function DetailContent() {
  return (
    <div className={classes.detailContainer}>
      {/* 시작일 / 종료일 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>시작일</div>
          <div className={classes.value}>2023-01-01</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>종료일</div>
          <div className={classes.value}>2023-12-31</div>
        </div>
      </div>

      {/* 리밸런싱 방법 / 리밸런싱 주기 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>리밸런싱 방법</div>
          <div className={classes.value}>균등</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>리밸런싱 주기</div>
          <div className={classes.value}>3개월</div>
        </div>
      </div>

      {/* 종목 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>종목</div>
          <div className={classes.value}>삼성전자, SK하이닉스</div>
        </div>
      </div>

      {/* 시작금액 / 종료금액 / 수익률 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>시작금액</div>
          <div className={classes.value}>10,000,000원</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>종료금액</div>
          <div className={classes.value}>15,000,000원</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>수익률</div>
          <div className={classes.value}>50%</div>
        </div>
      </div>

      {/* 최대 수익률 / 최대 낙폭 / 샤프 지수 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>최대 수익률</div>
          <div className={classes.value}>60%</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>최대 낙폭</div>
          <div className={classes.value}>10%</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>샤프 지수</div>
          <div className={classes.value}>1.5</div>
        </div>
      </div>
    </div>
  );
}
