import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ redirect: string }> }
) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Giải mã path đích: admin-dashboard -> /admin/dashboard
  const redirectParam = (await params).redirect
  const next = redirectParam === 'home' ? '/' : `/${redirectParam.replace(/-/g, '/')}`

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const host = request.headers.get('host') || requestUrl.host
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
      const protocol = isLocal ? 'http' : 'https'
      
      // Tạo URL chuyển hướng an toàn
      const redirectUrl = `${protocol}://${host}${next}`
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Nếu lỗi code hoặc auth, về trang lỗi
  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
}