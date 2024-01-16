import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parse } from 'url'

// This is a middleware that will run for every request. It will check if the
// user is authenticated and redirect to the login page if they are not.
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const url = req.nextUrl.clone()

  const errors = url.searchParams.getAll('error')

  // error parameters are present and have the expected values, redirect the user
  if (errors[0] === 'OAuthCallback') {
    url.pathname = '/premium-required'
    return NextResponse.rewrite(url)
  }

  https: if (url.pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  if (!token && url.pathname !== '/login' && url.pathname !== '/info') {
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
