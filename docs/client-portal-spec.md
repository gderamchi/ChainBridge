# Client Portal Feature Specification

## Overview

The Client Portal is a secure, authenticated area of ChainBridge where verified clients can access exclusive features, manage their accounts, and interact with their sourcing data. This specification focuses on the authentication layer using Supabase Magic Link.

---

## 1. Authentication System

### 1.1 Technology Stack

- **Authentication Provider**: Supabase Auth
- **Method**: Passwordless Magic Link
- **Framework**: Next.js 14+ with App Router
- **Client Library**: `@supabase/supabase-js`
- **SSR Support**: `@supabase/ssr`

### 1.2 Magic Link Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Login Page    │     │  Supabase Auth  │     │  User's Email   │
│                 │     │                 │     │                 │
│  Enter Email    │────▶│  Generate Link  │────▶│  Magic Link     │
│                 │     │                 │     │  Received       │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐              │
│  Client Portal  │◀────│  Auth Callback  │◀─────────────┘
│  Dashboard      │     │  /auth/confirm  │    User clicks link
└─────────────────┘     └─────────────────┘
```

### 1.3 Authentication Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| `shouldCreateUser` | `true` | Automatically create new user accounts on first sign-in |
| `emailRedirectTo` | `/auth/confirm` | Callback URL for magic link verification |
| OTP Expiry | 60 minutes (default) | Magic link validity period |
| Rate Limit | 1 request/60 seconds | Prevent spam/abuse |

### 1.4 User Flow

1. **Initiate Login**
   - User navigates to `/portal/login`
   - User enters their email address
   - System calls `supabase.auth.signInWithOtp()`

2. **Email Delivery**
   - Supabase sends magic link to user's email
   - User sees confirmation message with instructions

3. **Link Verification**
   - User clicks magic link in email
   - Browser redirects to `/auth/confirm` with token hash
   - System calls `supabase.auth.verifyOtp()` to exchange token for session

4. **Session Established**
   - User is redirected to `/portal` (Client Portal Dashboard)
   - Session is stored and managed by Supabase

5. **Session Persistence**
   - Sessions persist across browser refreshes
   - Automatic token refresh handled by Supabase

---

## 2. Page Structure

### 2.1 New Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/portal` | Client Portal Dashboard (placeholder) | ✅ Yes |
| `/portal/login` | Magic Link Login Page | ❌ No |
| `/auth/confirm` | Auth callback handler | ❌ No |

### 2.2 Route Protection

Protected routes will use Next.js middleware to:
- Check for valid Supabase session
- Redirect unauthenticated users to `/portal/login`
- Pass user context to protected pages

---

## 3. UI Components

### 3.1 Login Page (`/portal/login`)

**Layout:**
- Centered card design consistent with ChainBridge luxury aesthetic
- Glass panel effect with gold accent borders
- Responsive design (mobile-first)

**Elements:**
- ChainBridge logo/wordmark
- Heading: "Client Portal Access"
- Subheading with brief description
- Email input field with gold focus state
- "Send Magic Link" button (primary gold style)
- Loading state during submission
- Success/error message display
- Link back to main site

**Styling Classes (from existing design system):**
- Background: `bg-slate-dark`
- Panel: `glass-panel-luxury`
- Input: Consistent with Hero search input styling
- Button: `bg-gold-primary hover:bg-[#D4AF67] text-slate-900`
- Text: `text-white`, `text-text-muted`, `gold-text-gradient`
- Typography: `font-serif` for headings, `font-sans` for body

### 3.2 Auth Callback Page (`/auth/confirm`)

**Layout:**
- Minimal loading/processing indicator
- Auto-redirects on success
- Error display if verification fails

### 3.3 Portal Dashboard (`/portal`) - Placeholder

**Initial Implementation:**
- Welcome message with user email
- Sign out button
- "Coming Soon" placeholder content
- Consistent navigation with main site

---

## 4. Technical Implementation

### 4.1 Supabase Client Setup

```typescript
// lib/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts - Server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### 4.2 Magic Link Sign-In

```typescript
async function signInWithMagicLink(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  })
  
  return { data, error }
}
```

### 4.3 Token Verification (PKCE Flow)

```typescript
// app/auth/confirm/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/portal'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email',
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/portal/login?error=auth_failed`)
}
```

### 4.4 Middleware for Route Protection

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create response to modify
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
```

---

## 5. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 6. Error Handling

### 6.1 Error States

| Error | User Message | Action |
|-------|--------------|--------|
| Invalid email format | "Please enter a valid email address" | Highlight input |
| Rate limited | "Please wait before requesting another link" | Show countdown |
| Network error | "Connection error. Please try again." | Retry option |
| Invalid/expired link | "This link has expired. Request a new one." | Redirect to login |
| Auth verification failed | "Authentication failed. Please try again." | Show error + retry |

### 6.2 Loading States

- Button shows spinner + "Sending..." during submission
- Callback page shows loading indicator during verification
- Portal shows skeleton while fetching user data

---

## 7. Security Considerations

- Magic links expire after 60 minutes (configurable in Supabase)
- Links are single-use only
- PKCE flow prevents token interception
- Server-side session validation for all protected routes
- HTTP-only cookies for session storage
- CSRF protection via Supabase middleware

---

## 8. Future Enhancements (Out of Scope)

- Email OTP alternative to magic link
- Social OAuth providers (Google, LinkedIn)
- Two-factor authentication
- User profile management
- Role-based access control
- Session management (view active sessions, revoke)

---

## 9. Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.5.x"
}
```

---

## 10. Acceptance Criteria

### Authentication
- [ ] User can enter email and receive magic link
- [ ] Magic link successfully logs user in
- [ ] New users are automatically created (`shouldCreateUser: true`)
- [ ] Session persists across page refreshes
- [ ] User can sign out

### Route Protection
- [ ] Unauthenticated users are redirected to login
- [ ] Authenticated users can access portal
- [ ] Authenticated users are redirected from login to portal

### UI/UX
- [ ] Login page matches ChainBridge design system
- [ ] Loading states are displayed appropriately
- [ ] Error messages are user-friendly
- [ ] Mobile responsive design

### Error Handling
- [ ] Invalid emails show validation error
- [ ] Expired links show appropriate message
- [ ] Network errors are handled gracefully
