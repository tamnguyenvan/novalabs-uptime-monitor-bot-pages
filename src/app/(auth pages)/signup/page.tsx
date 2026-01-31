"use client"
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    let redirect = window.location.pathname.replace('/', '')
    redirect = redirect === '' ? 'home' : redirect
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/${redirect}/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-sm border border-[#dfe1e5] p-10">
        <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-6">
                <img src="/logo.png" alt="UptimeGuard Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#222222] mb-2">Join UptimeGuard</h1>
            <p className="text-[#707579] text-sm">Create an account to start monitoring.</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-[#dfe1e5] hover:bg-[#f4f4f5] text-[#222222] font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all mb-8"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="text-[11px] text-[#707579] text-center leading-relaxed">
          By continuing, you agree to our 
          <Link href="#" className="text-[#0088cc] px-1 hover:underline">Terms of Service</Link> 
          and 
          <Link href="#" className="text-[#0088cc] px-1 hover:underline">Privacy Policy</Link>.
        </div>

        <div className="mt-8 pt-6 border-t border-[#dfe1e5] text-center">
          <p className="text-sm text-[#707579]">
            Already have an account? <Link href="/login" className="text-[#0088cc] font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}