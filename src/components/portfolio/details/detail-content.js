import classes from './detail-content.module.css';

export default function DetailContent({ data }) {
  // 종목 데이터를 파싱하는 함수
  const parseAssets = (assets) => {
    if (!assets) return [];
    return assets.split(';').map((item) => {
      const [name, ratio] = item.split(',');
      return `${name} : ${ratio}%`;
    });
  };

  const parsedAssets = parseAssets(data.assets);

  // 종료금액 계산 함수
  const calculateEndMoney = (startMoney, rateReturn) => {
    if (!startMoney || rateReturn == null) return null;

    // 시작금액 숫자 변환
    const startMoneyNumber = parseFloat(startMoney.toString().replace(/,/g, ''));

    // 수익률을 %로 계산
    const rateReturnNumber = parseFloat(rateReturn); // SQLite에서 REAL로 저장된 숫자 처리

    // 종료금액 계산 및 포맷팅
    const endMoney = startMoneyNumber * (1 + rateReturnNumber / 100);
    return Math.round(endMoney).toLocaleString(); // 소수점 없이 반올림
  };

  // 소수점 둘째 자리에서 반올림 처리
  const formatNumber = (num, appendPercent = false) => {
    const rounded = parseFloat(num).toFixed(2);
    return appendPercent ? `${rounded}%` : rounded;
  };

  const endMoney = calculateEndMoney(data.startMoney, data.rate_return);

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
          <div className={classes.value}>
            {parsedAssets.map((asset, index) => (
              <div key={index}>{asset}</div> // 한 줄씩 표시
            ))}
          </div>
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
          <div className={classes.value}>{endMoney || '계산 불가'}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>수익률</div>
          <div className={classes.value}>{formatNumber(data.rate_return, true)}</div>
        </div>
      </div>

      {/* 최대 수익률 / 최대 낙폭 / 샤프 지수 */}
      <div className={classes.row}>
        <div className={classes.group}>
          <div className={classes.label}>최대 수익률</div>
          <div className={classes.value}>{formatNumber(data.max_rate_return, true)}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>최대 낙폭</div>
          <div className={classes.value}>{formatNumber(data.mdd)}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>샤프 지수</div>
          <div className={classes.value}>{formatNumber(data.sharpe_ratio)}</div>
        </div>
        <div className={classes.group}>
          <div className={classes.label}>켈리 지수</div>
          <div className={classes.value}>{formatNumber(data.kelly_ratio)}</div>
        </div>
      </div>
    </div>
  );
}
