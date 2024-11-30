import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const COOKIE_NAME = process.env.COOKIE_NAME;

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Paths that are publicly accessible
  const publicPaths = ['/auth/login', '/auth/signup'];

  // Function to check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  try {
    if (token) {
      // Verify the JWT token
      jwt.verify(token, JWT_SECRET);

      // If authenticated user tries to access login or signup pages, redirect them to the home page
      if (isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // Allow the request to proceed
      return NextResponse.next();
    } else {
      // If no token and trying to access a protected route, redirect to login
      if (!isPublicPath) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      // Allow access to public paths
      return NextResponse.next();
    }
  } catch (error) {
    // If token verification fails, redirect to login for protected routes
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Allow access to public paths
    return NextResponse.next();
  }
}

// Apply the middleware to all routes
export const config = {
  matcher: '/:path*',
};
