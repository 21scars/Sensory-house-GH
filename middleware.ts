// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Protect admin routes — must be ADMIN role
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // This runs first — return true = run middleware function, false = redirect to signIn
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // These routes require auth
        const protectedPaths = ['/dashboard', '/admin']
        const isProtected = protectedPaths.some(p => pathname.startsWith(p))
        if (isProtected) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
