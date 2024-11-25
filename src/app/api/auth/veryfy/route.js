import jwt from 'jsonwebtoken';

// 환경 변수 가져오기
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token'; // 기본값 설정

export async function GET(request) {
  // 쿠키에서 토큰 가져오기
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }

  try {
    // JWT 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);
    return new Response(JSON.stringify({ authenticated: true, user: decoded }), { status: 200 });
  } catch (error) {
    // 검증 실패 시
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
