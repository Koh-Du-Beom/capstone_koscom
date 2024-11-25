// app/api/auth/login/route.js
import db from '@/db';
import bcrypt from 'bcrypt';

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

  // 세션 또는 토큰 생성 로직을 추가할 수 있습니다.

  return new Response(JSON.stringify({ message: '로그인 성공' }), { status: 200 });
}
