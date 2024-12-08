import { NextResponse } from 'next/server';
import db from '@/db';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      email,
      portfolio_title,
      scraps, // scraps를 숫자로 받아온다고 가정
      sharpe_ratio,
      kelly_ratio,
      mdd,
      rate_return,
      max_rate_return,
      startDate,
      endDate,
      rebalancePeriod,
      method,
      startMoney,
      assets
    } = body;

    // 소수점 둘째자리로 반올림
    const roundedSharpeRatio = parseFloat(parseFloat(sharpe_ratio).toFixed(2));
    const roundedKellyRatio = parseFloat(parseFloat(kelly_ratio).toFixed(2));
    const roundedMdd = parseFloat(parseFloat(mdd).toFixed(2));
    const roundedRateReturn = parseFloat(parseFloat(rate_return).toFixed(2));
    const roundedMaxRateReturn = parseFloat(parseFloat(max_rate_return).toFixed(2));

    const insertStmt = db.prepare(`
      INSERT INTO portfolios (
        user_email, portfolio_title, scraps, 
        sharpe_ratio, kelly_ratio, mdd, 
        rate_return, max_rate_return,
        startDate, endDate, rebalancePeriod, 
        method, startMoney, assets
      )
      VALUES (
        @user_email, @portfolio_title, @scraps, 
        @sharpe_ratio, @kelly_ratio, @mdd, 
        @rate_return, @max_rate_return,
        @startDate, @endDate, @rebalancePeriod,
        @method, @startMoney, @assets
      )
    `);

    const result = insertStmt.run({
      user_email: email,
      portfolio_title,
      scraps,
      sharpe_ratio: roundedSharpeRatio,
      kelly_ratio: roundedKellyRatio,
      mdd: roundedMdd,
      rate_return: roundedRateReturn,
      max_rate_return: roundedMaxRateReturn,
      startDate,
      endDate,
      rebalancePeriod,
      method,
      startMoney,
      assets
    });

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error inserting portfolio:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(request) {
  try {
    // 클라이언트에서 이메일 파라미터를 쿼리로 받음
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ error: '이메일이 필요합니다.' }), { status: 400 });
    }

    // 데이터베이스에서 이메일을 기준으로 포트폴리오 가져오기
    const portfolios = db.prepare(`
      SELECT id, portfolio_title, scraps, sharpe_ratio, kelly_ratio, mdd, rate_return, max_rate_return, startDate, endDate, rebalancePeriod, method, startMoney, assets 
      FROM portfolios 
      WHERE user_email = ?
    `).all(email);

    // 포트폴리오가 없는 경우 처리
    if (portfolios.length === 0) {
      return new Response(JSON.stringify({ message: '포트폴리오가 없습니다.' }), { status: 200 });
    }

    // 포트폴리오 데이터 반환
    return new Response(JSON.stringify(portfolios), { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return new Response(JSON.stringify({ error: '서버 에러가 발생했습니다.' }), { status: 500 });
  }
}


//삭제
export async function DELETE(request) {
  try {
    const { email, title } = await request.json();

    if (!email || !title) {
      return new Response(JSON.stringify({ error: '이메일과 제목이 필요합니다.' }), { status: 400 });
    }

    const stmt = db.prepare(`
      DELETE FROM portfolios
      WHERE user_email = ? AND portfolio_title = ?
    `);
    const result = stmt.run(email, title);

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: '포트폴리오가 존재하지 않습니다.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: '포트폴리오가 삭제되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return new Response(JSON.stringify({ error: '서버 에러가 발생했습니다.' }), { status: 500 });
  }
}