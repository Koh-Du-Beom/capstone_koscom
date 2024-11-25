import db from '@/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const COOKIE_NAME = process.env.COOKIE_NAME || 'auth-token';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export async function POST(request) {
  const { email, password } = await request.json();

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);

  if (!user) {
    return new Response(JSON.stringify({ message: '이메일 또는 비밀번호가 잘못되었습니다.' }), { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return new Response(JSON.stringify({ message: '이메일 또는 비밀번호가 잘못되었습니다.' }), { status: 401 });
  }

  // JWT 생성
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // 쿠키 설정
  const response = NextResponse.json({ message: '로그인 성공' });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 3, // JWT_EXPIRES_IN에 따라 동적으로 변경 가능
    path: '/',
  });

  return response;
}
