import db from '@/db';

export async function GET(request) {
  try {
    // 데이터베이스에서 rate_return이 높은 5개의 데이터 가져오기
    const portfolios = db.prepare(`
      SELECT 
        portfolio_title AS portfolio_name,
        user_email AS email,
        assets AS mainStocks,
        startDate,
        endDate,
        rate_return AS rateReturns,
        sharpe_ratio AS sharpeRatio,
        mdd,
        scraps
      FROM portfolios
      ORDER BY rate_return DESC
      LIMIT 5
    `).all();

    // mainStocks를 숫자가 높은 두 항목만 남기도록 파싱
    const parseMainStocks = (assets) => {
      if (!assets) return '';
      return assets
        .split(';') // ';'로 나눔
        .map((item) => {
          const [name, ratio] = item.split(',');
          return { name, ratio: parseFloat(ratio) };
        })
        .sort((a, b) => b.ratio - a.ratio) // ratio 기준으로 내림차순 정렬
        .slice(0, 2) // 상위 두 개 선택
        .map((item) => item.name) // 종목 이름만 남김
        .join(', '); // ', '로 연결
    };

    // 기간을 계산하는 함수
    const calculatePeriod = (startDate, endDate) => {
      const startYear = parseInt(startDate.slice(0, 4), 10); // 시작 날짜의 연도 추출
      const endYear = parseInt(endDate.slice(0, 4), 10); // 종료 날짜의 연도 추출
      return `${endYear - startYear}년`; // 기간 계산
    };

    // rateReturns를 소수점 둘째 자리로 반올림하고 % 추가
    const formatRateReturns = (rateReturns) => {
      return `${parseFloat(rateReturns).toFixed(2)}%`; // 소수점 둘째 자리로 반올림 후 % 추가
    };

    // portfolios 데이터를 파싱
    const parsedPortfolios = portfolios.map((portfolio) => ({
      ...portfolio,
      mainStocks: parseMainStocks(portfolio.mainStocks), // mainStocks 필드 파싱
      period: calculatePeriod(portfolio.startDate, portfolio.endDate), // 기간 계산 후 period로 설정
      rateReturns: formatRateReturns(portfolio.rateReturns), // rateReturns 포맷팅
    }));

    return new Response(JSON.stringify(parsedPortfolios), { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return new Response(JSON.stringify({ error: '데이터를 가져오는 중 문제가 발생했습니다.' }), { status: 500 });
  }
}
