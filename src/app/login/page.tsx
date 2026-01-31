"use client"
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full border-2 border-black bg-white p-10 brutalist-shadow">
        <h1 className="font-mono text-3xl font-bold mb-2 uppercase italic tracking-tighter">Identify_Self</h1>
        <p className="font-mono text-xs text-gray-500 mb-8 lowercase tracking-tight">Accessing restricted administrative terminal...</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full border-2 border-black p-3 font-mono text-sm focus:bg-yellow-50 outline-none"
              placeholder="admin@uptimeguard.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="w-full bg-black text-white font-mono font-bold py-4 brutalist-shadow hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            SEND MAGIC LINK
          </button>
        </form>
        
        <div className="mt-12 pt-6 border-t border-gray-100 font-mono text-[10px] text-gray-400 text-center uppercase tracking-widest">
          Secured by Supabase Auth Engine v4.0
        </div>
      </div>
    </div>
  );
}