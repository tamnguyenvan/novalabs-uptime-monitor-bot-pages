import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: { redirect: string } }
) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Get direct path from params.redirect
  let redirectPath = params.redirect || '/'
  redirectPath = redirectPath === 'home' ? '/' : `/${redirectPath}`

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      throw error
    }

    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    
    let baseUrl: string
    
    if (isLocalEnv) {
      baseUrl = requestUrl.origin
    } else if (forwardedHost) {
      baseUrl = `https://${forwardedHost}`
    } else {
      baseUrl = requestUrl.origin
    }

    const redirectUrl = `${baseUrl}${redirectPath}`
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
  }
}