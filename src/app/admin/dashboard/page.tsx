import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Users, Globe, Search, 
  CreditCard, TrendingUp, ShieldCheck, 
  LayoutDashboard, LogOut, Settings, Bell,
  ChevronRight, MoreHorizontal, ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const runtime = 'edge';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const query = (await searchParams).q || "";

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!adminProfile?.is_admin) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#f4f4f5] text-[#707579]">
            <ShieldCheck size={48} className="text-[#e53935] mb-4" />
            <h1 className="text-xl font-bold text-[#222222]">Access Restricted</h1>
            <p>You do not have permission to view this area.</p>
            <Link href="/" className="mt-6 text-[#0088cc] hover:underline">Back to Home</Link>
        </div>
    );
  }

  // 2. Fetch Data
  const { data: tgUsers } = await supabase
    .from("telegram_users")
    .select(`*, monitors ( id, url, status, is_active )`)
    .order('created_at', { ascending: false });

  let filteredUsers = tgUsers || [];

  if (query) {
    filteredUsers = filteredUsers.filter(u => 
      u.username?.toLowerCase().includes(query.toLowerCase()) || 
      u.first_name?.toLowerCase().includes(query.toLowerCase()) ||
      String(u.telegram_id).includes(query)
    );
  }

  // 3. Stats Calculation
  const activeMonitors = filteredUsers.flatMap(u => u.monitors?.filter((m: any) => m.is_active) || []);
  const paidUsers = filteredUsers.filter(u => u.plan !== 'free');
  const MRR = paidUsers.reduce((acc, curr) => {
      if (curr.plan === 'pro') return acc + 6;
      if (curr.plan === 'business') return acc + 18;
      return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex font-sans text-[#222222]">
      
      {/* SIDEBAR - Fixed Left */}
      <aside className="w-72 bg-white border-r border-[#dfe1e5] flex-col hidden lg:flex fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-[#dfe1e5]">
            <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
                <div className="w-8 h-8 bg-[#0088cc] rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-200">
                    <ActivityIcon />
                </div>
                <span>UptimeGuard</span>
            </div>
        </div>

        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
            <div className="px-3 py-2 text-[11px] font-bold text-[#707579] uppercase tracking-wider">Overview</div>
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<Globe size={20} />} label="Live Monitors" />
            <NavItem icon={<Users size={20} />} label="Customers" />
            
            <div className="px-3 py-2 mt-6 text-[11px] font-bold text-[#707579] uppercase tracking-wider">Configuration</div>
            <NavItem icon={<Settings size={20} />} label="Settings" />
            <NavItem icon={<Bell size={20} />} label="Alert Rules" />
        </div>

        <div className="p-4 border-t border-[#dfe1e5]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f4f4f5] border border-[#dfe1e5]">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">Admin</div>
                    <div className="text-xs text-[#707579] truncate">{user.email}</div>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT - Right Side */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#dfe1e5] sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
                 {/* Mobile Menu Trigger Placeholder */}
                 <span className="font-bold">UptimeGuard</span>
            </div>

            {/* Search Bar - Style Telegram */}
            <div className="hidden lg:block flex-1 max-w-md">
                <form className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707579] group-focus-within:text-[#0088cc] transition-colors" size={18} />
                    <input 
                        name="q"
                        defaultValue={query}
                        placeholder="Search users (ID, Name, Username)..."
                        className="w-full bg-[#f4f4f5] border border-transparent focus:border-[#0088cc] focus:bg-white rounded-xl pl-11 pr-4 py-2 text-sm outline-none transition-all placeholder-[#707579]"
                    />
                </form>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-[#707579] hover:bg-[#f4f4f5] rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#e53935] rounded-full ring-2 ring-white"></span>
                </button>
                <div className="h-6 w-[1px] bg-[#dfe1e5]"></div>
                <button className="text-sm font-medium text-[#707579] hover:text-[#e53935] transition-colors flex items-center gap-2">
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>

        <main className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
            
            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard 
                    label="Active Monitors" 
                    value={activeMonitors.length} 
                    icon={<Globe size={24} />}
                    color="text-[#0088cc]"
                    bg="bg-blue-50"
                    trend="+12% this week"
                />
                <StatCard 
                    label="Total Users" 
                    value={filteredUsers.length} 
                    icon={<Users size={24} />}
                    color="text-[#222222]"
                    bg="bg-gray-100"
                    trend="New user just now"
                />
                <StatCard 
                    label="Paid Subscribers" 
                    value={paidUsers.length} 
                    icon={<ShieldCheck size={24} />}
                    color="text-purple-600"
                    bg="bg-purple-50"
                    trend="5% conversion rate"
                />
                <StatCard 
                    label="Est. Monthly Revenue" 
                    value={`$${MRR}`} 
                    icon={<CreditCard size={24} />}
                    color="text-[#31b545]"
                    bg="bg-green-50"
                    trend="Based on active plans"
                />
            </div>

            {/* USERS TABLE SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#222222]">Recent Users</h2>
                    <div className="flex gap-2">
                         <button className="px-3 py-1.5 text-xs font-bold text-[#0088cc] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Export CSV</button>
                    </div>
                </div>

                <div className="bg-white border border-[#dfe1e5] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f4f4f5] border-b border-[#dfe1e5] text-xs font-bold text-[#707579] uppercase tracking-wider">
                                    <th className="px-6 py-4">Telegram User</th>
                                    <th className="px-6 py-4">Current Plan</th>
                                    <th className="px-6 py-4">Monitored Sites</th>
                                    <th className="px-6 py-4 text-right">Joined</th>
                                    <th className="px-6 py-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dfe1e5]">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#707579]">
                                            <Search size={40} className="mx-auto mb-3 opacity-20" />
                                            <p>No users found matching "{query}"</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <UserRow key={u.telegram_id} user={u} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className="px-6 py-4 border-t border-[#dfe1e5] bg-gray-50 flex items-center justify-between text-xs text-[#707579]">
                        <span>Showing {filteredUsers.length} results</span>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 bg-white border border-[#dfe1e5] rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                            <button className="px-3 py-1 bg-white border border-[#dfe1e5] rounded hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}

// === COMPONENTS ===

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
            ${active 
                ? 'bg-[#0088cc]/10 text-[#0088cc]' 
                : 'text-[#222222] hover:bg-[#f4f4f5]'
            }
        `}>
            <div className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#0088cc]' : 'text-[#707579]'}`}>
                {icon}
            </div>
            <span className={`text-sm font-semibold ${active ? 'font-bold' : ''}`}>{label}</span>
            {active && <ChevronRight size={14} className="ml-auto" />}
        </div>
    )
}

function StatCard({ label, value, icon, color, bg, trend }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-[#dfe1e5] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
                {/* Sparkline placeholder or menu */}
                <button className="text-[#dfe1e5] hover:text-[#707579]"><MoreHorizontal size={20}/></button>
            </div>
            <div>
                <div className="text-3xl font-black text-[#222222] tracking-tight">{value}</div>
                <div className="text-sm font-medium text-[#707579] mt-1">{label}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f4f4f5] flex items-center gap-1.5 text-[11px] font-bold text-[#707579]">
                <TrendingUp size={12} className="text-[#31b545]" />
                {trend}
            </div>
        </div>
    )
}

function UserRow({ user }: { user: any }) {
    const monitors = user.monitors?.filter((m: any) => m.is_active) || [];
    const displayMonitors = monitors.slice(0, 2);
    const remaining = monitors.length - 2;

    const planColors: Record<string, string> = {
        free: "bg-gray-100 text-gray-600 border-gray-200",
        pro: "bg-blue-50 text-[#0088cc] border-blue-100",
        business: "bg-purple-50 text-purple-600 border-purple-100"
    };

    return (
        <tr className="group hover:bg-[#f4f4f5]/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {/* Avatar Initials */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-tr from-[#0088cc] to-[#33aadd]`}>
                        {user.first_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <div className="font-bold text-[#222222] text-sm">{user.first_name || "Unknown"}</div>
                        <div className="text-xs text-[#707579] flex items-center gap-1">
                             @{user.username || "no_username"} 
                             <span className="w-1 h-1 bg-[#dfe1e5] rounded-full"></span> 
                             ID: {user.telegram_id}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${planColors[user.plan] || planColors.free}`}>
                    {user.plan}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                    {displayMonitors.length === 0 ? (
                        <span className="text-xs text-[#707579] italic opacity-60">No active monitors</span>
                    ) : (
                        displayMonitors.map((m: any) => (
                            <a 
                                key={m.id} 
                                href={m.url} 
                                target="_blank" 
                                className="flex items-center gap-2 text-xs font-medium text-[#222222] hover:text-[#0088cc] transition-colors group/link max-w-[220px] truncate"
                            >
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status === 'up' ? 'bg-[#31b545] shadow-[0_0_8px_rgba(49,181,69,0.4)]' : 'bg-[#e53935]'}`}></span>
                                <span className="truncate">{m.url.replace(/^https?:\/\//, '')}</span>
                                <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                        ))
                    )}
                    {remaining > 0 && (
                        <span className="text-[10px] font-bold text-[#707579] bg-[#f4f4f5] px-2 py-0.5 rounded-md w-fit">
                            +{remaining} others
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="text-sm font-medium text-[#222222]">{new Date(user.created_at).toLocaleDateString('en-GB')}</div>
                <div className="text-xs text-[#707579]">{new Date(user.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="p-2 text-[#707579] hover:bg-white hover:text-[#0088cc] hover:shadow-sm rounded-lg transition-all">
                    <MoreHorizontal size={18} />
                </button>
            </td>
        </tr>
    );
}

// Little Logo helper
function ActivityIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
    )
}