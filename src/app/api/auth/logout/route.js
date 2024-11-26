import { NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token'; // 환경 변수에서 쿠키 이름 가져오기

export async function POST() {
  const response = NextResponse.json({ message: '로그아웃 성공' });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // 즉시 삭제
    path: '/', // 생성 시와 동일한 경로 사용
  });

  return response;
}
