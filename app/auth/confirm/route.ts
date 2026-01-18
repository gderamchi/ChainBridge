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
    });

    console.log("__ERR_OTP__", JSON.stringify(error, null, 2));

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Encode error details as query parameters
    const errorParams = new URLSearchParams({
      error: 'auth_failed',
      cause: String(error.cause || 'unknown'),
      message: error.message || 'Authentication failed',
    })

    return NextResponse.redirect(`${origin}/portal/login?${errorParams.toString()}`)
  }

  const errorParams = new URLSearchParams({
    error: 'auth_failed',
    cause: 'missing_token',
    message: 'Magic link token not found',
  })

  return NextResponse.redirect(`${origin}/portal/login?${errorParams.toString()}`)
}
