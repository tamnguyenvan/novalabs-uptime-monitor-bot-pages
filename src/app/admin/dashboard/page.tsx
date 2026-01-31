import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Globe, AlertTriangle, CheckCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // 1. Check Auth & Admin Status
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return <div className="p-24 text-center font-mono">ACCESS_DENIED: Admin privileges required.</div>;
  }

  // 2. Fetch Stats
  const { data: users } = await supabase.from("profiles").select("*, monitors(count)");
  const { data: monitors } = await supabase.from("monitors").select("*");

  const totalMonitors = monitors?.length || 0;
  const downMonitors = monitors?.filter(m => m.status === 'down').length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-mono text-3xl font-bold uppercase tracking-tighter">Admin_Panel</h1>
            <p className="text-gray-500 font-mono text-sm">System oversight and user monitoring</p>
          </div>
          <div className="font-mono text-xs bg-black text-white px-3 py-1">v2.0.4-stable</div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Users" value={users?.length || 0} icon={<Users size={20} />} />
          <StatCard label="Monitored Endpoints" value={totalMonitors} icon={<Globe size={20} />} />
          <StatCard label="Critical Issues" value={downMonitors} icon={<AlertTriangle size={20} />} className="text-brand-red border-brand-red" />
          <StatCard label="System Health" value="99.9%" icon={<CheckCircle size={20} />} className="text-brand-green border-brand-green" />
        </div>

        {/* Users Table */}
        <div className="border-2 border-black bg-white brutalist-shadow overflow-hidden">
          <div className="bg-black text-white p-4 font-mono text-sm font-bold uppercase tracking-widest">
            Active_Users_Registry
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black font-mono text-xs uppercase bg-gray-50">
                  <th className="p-4">Username</th>
                  <th className="p-4">Telegram ID</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Endpoints</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {users?.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                    <td className="p-4 font-bold">{u.username || 'Anonymous'}</td>
                    <td className="p-4 text-gray-500">{u.telegram_id || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border border-black text-[10px] font-bold uppercase ${u.plan === 'pro' ? 'bg-black text-white' : 'bg-white'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-4">{(u.monitors as any)[0]?.count || 0}</td>
                    <td className="p-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
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

function StatCard({ label, value, icon, className = "" }: any) {
  return (
    <div className={`border-2 border-black bg-white p-6 brutalist-shadow flex justify-between items-start ${className}`}>
      <div>
        <div className="font-mono text-xs uppercase text-gray-500 font-bold mb-2">{label}</div>
        <div className="font-mono text-3xl font-bold">{value}</div>
      </div>
      <div className="p-2 border-2 border-black">{icon}</div>
    </div>
  );
}