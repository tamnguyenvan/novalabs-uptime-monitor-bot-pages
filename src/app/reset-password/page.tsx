"use client"
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
        alert(error.message);
    } else {
        alert("Password updated successfully!");
        router.push("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[--color-tg-secondary-bg] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-sm border border-[--color-tg-divider] p-8">
        <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
        <p className="text-[--color-tg-hint] text-sm mb-8">Please enter your new password below.</p>

        <form onSubmit={handleUpdate} className="space-y-4">
            <div>
                <input 
                    type="password" 
                    required
                    className="tg-input"
                    placeholder="New Password"
                    value={password}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button 
                disabled={loading}
                className="w-full bg-[--color-tg-blue] text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
        </form>
      </div>
    </div>
  );
}