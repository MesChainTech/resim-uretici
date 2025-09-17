import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  // Static assets and Next.js internal paths
  '/_next(.*)',
  '/favicon.ico',
  '/robots.txt',
])

// Define protected API routes that require authentication
const isProtectedApiRoute = createRouteMatcher([
  '/api/generate',
  '/api/download(.*)',
  '/api/webhook/callback', // Even webhooks should be protected in some way
])

// Define protected page routes that require authentication
const isProtectedPageRoute = createRouteMatcher([
  '/generate(.*)',
  '/dashboard(.*)',
  '/profile(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl

  // Allow public routes to pass through without authentication
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Protect API routes - require authentication
  if (isProtectedApiRoute(request)) {
    try {
      const authResult = await auth()
      if (!authResult.userId) {
        // Return 401 for API routes instead of redirecting
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          },
          { status: 401 }
        )
      }
      return NextResponse.next()
    } catch (error) {
      // Return 401 for API routes instead of redirecting
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }
  }

  // Protect page routes - redirect to sign-in if not authenticated
  if (isProtectedPageRoute(request)) {
    try {
      const authResult = await auth()
      if (!authResult.userId) {
        // Redirect to sign-in page with return URL
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('redirect_url', request.url)
        return NextResponse.redirect(signInUrl)
      }
      return NextResponse.next()
    } catch (error) {
      // Redirect to sign-in page with return URL
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // For any other routes, allow them to pass through
  // This provides a fallback for routes not explicitly defined above
  return NextResponse.next()
})

export const config = {
  // Match all routes except static files and Next.js internal paths
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.* (files with extensions like .js, .css, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    // Always match the root path
    '/',
    // Match API and TRPC routes
    '/(api|trpc)(.*)',
  ],
}
