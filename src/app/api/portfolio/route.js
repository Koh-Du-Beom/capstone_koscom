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
