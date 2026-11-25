import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('clipflow_session')?.value;
  const { pathname } = request.nextUrl;

  // Protected creation routes requiring an active authenticated creator session
  const protectedRoutes = ['/projects/new', '/campaigns/new', '/assets/upload'];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/projects/new', '/campaigns/new', '/assets/upload'],
};
