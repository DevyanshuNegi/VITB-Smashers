import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '~/server/auth'

export async function middleware(request: NextRequest) {
  // Define paths that require authentication
  const protectedPaths = ['/dashboard', '/product/*']
  
  // Check if the user is trying to access protected routes
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    // Get the session
    const session = await auth()
    
    // If no session, redirect to sign in
    if (!session?.user) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      // Add callback URL to redirect back after sign in
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // For API routes, we'll let the individual route handlers handle auth
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
