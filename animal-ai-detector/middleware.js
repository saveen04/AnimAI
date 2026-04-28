import { NextResponse } from 'next/server';
import { verifyToken, getAuthCookieName } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/about'];
const API_AUTH_PATHS = ['/api/auth/login', '/api/auth/signup', '/api/auth/logout', '/api/auth/me'];

function isPublic(pathname) {
  if (pathname.startsWith('/api/auth/')) return true;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isProtected(pathname) {
  if (pathname.startsWith('/api/detect') || pathname.startsWith('/api/history')) return true;
  if (pathname.startsWith('/api/profile')) return true;
  return ['/dashboard', '/detection', '/upload', '/camera', '/history', '/settings'].some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);
  if (!payload?.userId) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/detection/:path*', '/upload/:path*', '/camera/:path*', '/history/:path*', '/settings/:path*', '/api/detect', '/api/history', '/api/profile'],
};
