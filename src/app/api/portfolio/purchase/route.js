import db from '@/db';

export async function POST(request) {
  try {
    const { portfolio_name, publisher_email, email } = await request.json();

    // 1. `publisher_email`과 `portfolio_name`을 기준으로 데이터 검색
    const portfolio = db.prepare(`
      SELECT * FROM portfolios
      WHERE user_email = ? AND portfolio_title = ?
    `).get(publisher_email, portfolio_name);

    if (!portfolio) {
      return new Response(
        JSON.stringify({ message: '포트폴리오를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    // 2. 현재 사용자의 이메일로 데이터 수정
    const newPortfolio = { ...portfolio, user_email: email };

    // 3. 수정된 데이터를 데이터베이스에 삽입
    const insertStmt = db.prepare(`
      INSERT INTO portfolios (
        user_email, portfolio_title, scraps, sharpe_ratio, kelly_ratio,
        mdd, rate_return, max_rate_return, startDate, endDate,
        rebalancePeriod, method, startMoney, assets
      ) VALUES (
        @user_email, @portfolio_title, @scraps, @sharpe_ratio, @kelly_ratio,
        @mdd, @rate_return, @max_rate_return, @startDate, @endDate,
        @rebalancePeriod, @method, @startMoney, @assets
      )
    `);

    insertStmt.run(newPortfolio);

    return new Response(JSON.stringify({ message: '포트폴리오가 성공적으로 복제되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return new Response(
      JSON.stringify({ message: '포트폴리오를 구매하는 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}
