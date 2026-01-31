"use client"
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    // Luôn redirect về trang dashboard sau khi login thành công
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/admin-dashboard/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) {
        alert(error.message);
        setGoogleLoading(false);
    }
};

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert(error.message);
    } else {
        window.location.href = "/admin/dashboard";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-sm border border-[#dfe1e5] p-10">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#222222] mb-2">Welcome Back</h1>
            <p className="text-[#707579] text-sm">Enter your credentials to manage monitors</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full bg-white border-2 border-[#dfe1e5] hover:bg-[#f4f4f5] text-[#222222] font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all mb-6"
        >
          {googleLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
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
        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-[#dfe1e5]"></div>
          <span className="flex-shrink-0 mx-4 text-[#707579] text-xs font-medium">OR</span>
          <div className="flex-grow border-t border-[#dfe1e5]"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-[#707579] uppercase ml-1 mb-1 block tracking-wider">Email Address</label>
                <input 
                    type="email" 
                    required
                    className="tg-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="text-xs font-bold text-[#707579] uppercase ml-1 mb-1 block tracking-wider">Password</label>
                <input 
                    type="password" 
                    required
                    className="tg-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-right mt-2">
                    <Link href="/forgot-password" className="text-xs text-[#0088cc] font-bold hover:underline">
                        Forgot password?
                    </Link>
                </div>
            </div>
            <button 
                disabled={loading}
                className="w-full btn-tg-primary py-3.5 text-lg"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
            </button>
        </form>
        
        <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-[#dfe1e5]"></div>
            <span className="flex-shrink-0 mx-4 text-[#707579] text-[10px] font-bold uppercase tracking-widest">Secure Access</span>
            <div className="flex-grow border-t border-[#dfe1e5]"></div>
        </div>

        <p className="text-center text-sm text-[#707579]">
          New to UptimeGuard? <Link href="/signup" className="text-[#0088cc] font-bold hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}