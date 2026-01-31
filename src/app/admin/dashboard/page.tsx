import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Globe, AlertCircle, Activity, Search, MoreHorizontal } from "lucide-react";

export const runtime = 'edge';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  console.log(user)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  console.log('profile', profile)

  if (!profile?.is_admin) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[--color-tg-secondary-bg]">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-red-500" size={32} />
                </div>
                <h1 className="text-xl font-bold">Access Denied</h1>
                <p className="text-[--color-tg-hint]">You do not have administrative privileges.</p>
            </div>
        </div>
    );
  }

  const { data: users } = await supabase.from("profiles").select("*, monitors(count)");
  const { data: monitors } = await supabase.from("monitors").select("*");

  const totalMonitors = monitors?.length || 0;
  const downMonitors = monitors?.filter(m => m.status === 'down').length || 0;

  return (
    <div className="min-h-screen bg-[--color-tg-secondary-bg] font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-[--color-tg-divider] sticky top-0 z-10">
        <div className="tg-container h-16 flex items-center justify-between">
            <h1 className="font-bold text-lg">Admin Console</h1>
            <div className="flex items-center gap-4">
                <div className="text-sm text-[--color-tg-hint]">{user.email}</div>
                <div className="w-8 h-8 bg-[--color-tg-blue] rounded-full text-white flex items-center justify-center text-sm font-bold">
                    A
                </div>
            </div>
        </div>
      </header>

      <div className="tg-container py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={users?.length || 0} icon={<Users size={20} className="text-[--color-tg-blue]" />} />
          <StatCard label="Monitors" value={totalMonitors} icon={<Globe size={20} className="text-[--color-tg-blue]" />} />
          <StatCard label="Critical Issues" value={downMonitors} icon={<AlertCircle size={20} className="text-[--color-tg-red]" />} />
          <StatCard label="System Health" value="99.9%" icon={<Activity size={20} className="text-[--color-tg-green]" />} />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-[--color-tg-divider] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[--color-tg-divider] flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-md">User Registry</h2>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-[--color-tg-blue] transition-colors" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-[--color-tg-hint] uppercase bg-white border-b border-[--color-tg-divider]">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Telegram ID</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Monitors</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users?.map((u) => (
                  <tr key={u.id} className="border-b border-[--color-tg-divider] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-medium">{u.username || 'Anonymous'}</div>
                        <div className="text-xs text-[--color-tg-hint]">{u.id.substring(0,8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-[--color-tg-hint] font-mono text-xs">{u.telegram_id || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        u.plan === 'pro' 
                            ? 'bg-blue-50 text-blue-600 border-blue-200' 
                            : u.plan === 'enterprise' 
                                ? 'bg-purple-50 text-purple-600 border-purple-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">{(u.monitors as any)[0]?.count || 0}</td>
                    <td className="px-6 py-4 text-[--color-tg-hint]">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-black">
                            <MoreHorizontal size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[--color-tg-divider] shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div className="text-sm text-[--color-tg-hint] font-medium">{label}</div>
        <div className="p-2 rounded-lg bg-[--color-tg-secondary-bg]">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}