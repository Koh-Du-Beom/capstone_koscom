import classes from './detail-content.module.css';

export default function DetailContent({ data }) {
  return (
    <div className={classes.detailContainer}>
      {/* 시작일 / 종료일 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>시작일</div>
          <div className={classes.value}>{data.startDate}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>종료일</div>
          <div className={classes.value}>{data.endDate}</div>
        </div>
      </div>

      {/* 리밸런싱 방법 / 리밸런싱 주기 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>리밸런싱 방법</div>
          <div className={classes.value}>{data.method}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>리밸런싱 주기</div>
          <div className={classes.value}>{data.rebalancePeriod}</div>
        </div>
      </div>

      {/* 종목 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>종목</div>
          <div className={classes.value}>{data.assets}</div>
          {/* 종목 파싱해서 보여줘야함 */}
        </div>
      </div>

      {/* 시작금액 / 종료금액 / 수익률 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>시작금액</div>
          <div className={classes.value}>{data.startMoney}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>종료금액</div>
          <div className={classes.value}>수익률이랑 종료금액으로 파싱</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>수익률</div>
          <div className={classes.value}>{data.rate_return}</div>
        </div>
      </div>

      {/* 최대 수익률 / 최대 낙폭 / 샤프 지수 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>최대 수익률</div>
          <div className={classes.value}>{data.max_rate_return}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>최대 낙폭</div>
          <div className={classes.value}>{data.mdd}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>샤프 지수</div>
          <div className={classes.value}>{data.sharpe_ratio}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>켈리 지수</div>
          <div className={classes.value}>{data.kelly_ratio}</div>
        </div>
      </div>
    </div>
  );
}
