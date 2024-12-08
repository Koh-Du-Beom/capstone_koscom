import { NextResponse } from 'next/server';
import db from '@/db';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      email,
      portfolio_title,
      scraps,           // scraps를 숫자로 받아온다고 가정
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

    // scraps가 문자열 형태일 가능성을 고려한다면 숫자로 변환:
    // const scrapsNumber = parseInt(scraps, 10);

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
      scraps, // 숫자로 전달되었다고 가정. 필요하면 scraps: scrapsNumber 로
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
    });

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error inserting portfolio:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import db from '@/db'; // db.js 파일에서 데이터베이스 가져오기

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
