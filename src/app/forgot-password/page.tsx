"use client"
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
        alert(error.message);
    } else {
        setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[--color-tg-secondary-bg] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-sm border border-[--color-tg-divider] p-8">
        <Link href="/login" className="text-[--color-tg-hint] hover:text-black flex items-center gap-1 text-sm mb-6">
            <ArrowLeft size={16} /> Back to Login
        </Link>

        {sent ? (
             <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Check your email</h2>
                <p className="text-[--color-tg-hint] text-sm">
                    We have sent a password reset link to <br/><strong>{email}</strong>
                </p>
                <button onClick={() => setSent(false)} className="mt-6 text-[--color-tg-blue] text-sm font-medium hover:underline">
                    Try another email
                </button>
             </div>
        ) : (
            <>
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-[--color-tg-hint] text-sm mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <input 
                            type="email" 
                            required
                            className="tg-input"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button 
                        disabled={loading}
                        className="w-full bg-[--color-tg-blue] text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
}