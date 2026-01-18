import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Placeholder for future rate limiting logic.
// This function can be expanded to use Redis or another store.
async function checkRateLimit(request: NextRequest): Promise<boolean> {
  // Currently allows all requests.
  return true;
}

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting Check for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const isAllowed = await checkRateLimit(request);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
  }

  // Create response to modify
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Check if env vars are defined to avoid runtime errors, although strictly they should be
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /portal routes (except login)
  if (request.nextUrl.pathname.startsWith('/portal') && 
      !request.nextUrl.pathname.startsWith('/portal/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/portal/login' && user) {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  return response
}

export const config = {
  matcher: ['/portal/:path*', '/auth/:path*'],
}
