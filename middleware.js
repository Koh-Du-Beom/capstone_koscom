import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const COOKIE_NAME = process.env.COOKIE_NAME;

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // 공개적으로 접근 가능한 경로
  const publicPaths = ['/auth/login', '/auth/signup'];

  // 현재 경로가 공개 경로인지 확인
  const isPublicPath = publicPaths.includes(pathname);

  try {
    if (token) {
      // JWT 토큰 검증
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

      // 인증된 사용자가 로그인 또는 회원가입 페이지에 접근하면 홈으로 리다이렉트
      if (isPublicPath) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
      }
      // 요청을 그대로 진행
      return NextResponse.next();
    } else {
      // 토큰이 없고 보호된 경로에 접근하려는 경우 로그인 페이지로 리다이렉트
      if (!isPublicPath) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
      }
      // 공개 경로에 대한 접근 허용
      return NextResponse.next();
    }
  } catch (error) {
    // 토큰 검증 실패 시 보호된 경로는 로그인 페이지로 리다이렉트
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }
    // 공개 경로에 대한 접근 허용
    return NextResponse.next();
  }
}

// 모든 경로에 미들웨어 적용
export const config = {
  matcher: '/:path*',
};
