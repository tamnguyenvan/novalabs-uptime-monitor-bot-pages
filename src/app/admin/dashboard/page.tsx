"use client"
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Users, Globe, AlertCircle, Activity, Search,
  MoreHorizontal, ShieldCheck, Mail, Calendar,
  Database, LayoutDashboard, Settings, LogOut,
  ChevronRight, TrendingUp, Clock
} from "lucide-react";
import { User } from "@supabase/supabase-js";

export const runtime = 'edge';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  plan: string;
  created_at: string;
  monitors?: { count: number };
}

export default function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMonitors: 0,
    downMonitors: 0,
    proUsers: 0
  });
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push("/login");
          return;
        }
        setUser(currentUser);
        // Check if admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", currentUser.id)
          .single();
        if (!profile?.is_admin) {
          router.push("/");
          return;
        }
        // Fetch data
        const [profilesRes, monitorsRes] = await Promise.all([
          supabase.from("profiles").select("*, monitors(count)").order('created_at', { ascending: false }),
          supabase.from("monitors").select("*")
        ]);
        const users = profilesRes.data || [];
        const monitors = monitorsRes.data || [];
        setAllUsers(users);
        setFilteredUsers(users);
        
        // Calculate stats
        setStats({
          totalUsers: users.length,
          totalMonitors: monitors.length,
          downMonitors: monitors.filter(m => m.status === 'down').length,
          proUsers: users.filter(u => u.plan !== 'free').length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const filtered = allUsers.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(allUsers);
    }
  }, [searchQuery, allUsers]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#e0e0e0]"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-[#0088cc] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-[#707579] font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#dfe1e5] flex flex-col">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-[#dfe1e5]">
          <div className="w-9 h-9 bg-[#0088cc] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <div>
            <div className="font-semibold text-sm text-[#222222]">UptimeGuard</div>
            <div className="text-[10px] text-[#707579] font-medium uppercase tracking-wide">Admin Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem icon={<Users size={18} />} label="Users" />
          <NavItem icon={<Globe size={18} />} label="Monitors" />
          <NavItem icon={<Activity size={18} />} label="Analytics" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-[#dfe1e5]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f4f4f5]">
            <div className="w-9 h-9 bg-[#0088cc] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#222222] truncate">
                {user?.email?.split('@')[0]}
              </div>
              <div className="text-xs text-[#707579]">Administrator</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-[#707579] hover:text-[#e53935] transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#dfe1e5] px-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#222222]">Dashboard Overview</h1>
            <p className="text-xs text-[#707579]">Monitor and manage your system</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f5] rounded-lg text-xs font-medium text-[#707579]">
              <Clock size={14} />
              Last updated: Just now
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={stats.totalUsers}
                icon={<Users size={20} />}
                trend="+12%"
                trendUp
              />
              <StatCard
                label="Active Monitors"
                value={stats.totalMonitors}
                icon={<Globe size={20} />}
                trend="Live"
              />
              <StatCard
                label="Critical Issues"
                value={stats.downMonitors}
                icon={<AlertCircle size={20} />}
                isAlert={stats.downMonitors > 0}
              />
              <StatCard
                label="Pro Subscribers"
                value={stats.proUsers}
                icon={<Activity size={20} />}
                trend="+8%"
                trendUp
              />
            </div>

            {/* User Management Table */}
            <div className="bg-white border border-[#dfe1e5] rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="p-5 border-b border-[#dfe1e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-base text-[#222222]">User Management</h2>
                  <p className="text-sm text-[#707579] mt-0.5">Review and manage system access levels</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707579]" size={16} />
                    <form>
                      <input
                        name="q"
                        defaultValue={searchQuery}
                        placeholder="Search users..."
                        className="w-full md:w-64 bg-[#f4f4f5] border-none rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-[#0088cc]/20"
                      />
                    </form>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-[#dfe1e5]">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707579] uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707579] uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-[#707579] uppercase tracking-wider">
                        Monitors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707579] uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707579] uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-[#707579] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dfe1e5] bg-white">
                    {allUsers.length > 0 ? allUsers.map((u) => (
                      <tr key={u.id} className="bg-white">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#f4f4f5] flex items-center justify-center font-semibold text-sm text-[#0088cc]">
                              {u.username?.[0]?.toUpperCase() || <Mail size={16} className="text-[#707579]" />}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-[#222222]">
                                {u.username || 'Anonymous'}
                              </div>
                              <div className="text-xs text-[#707579]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <PlanBadge plan={u.plan} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f4f5] text-[#222222] rounded-md font-semibold text-xs">
                            <Database size={12} className="text-[#0088cc]" />
                            {(u.monitors as any)[0]?.count || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-[#707579]">
                            <Calendar size={14} />
                            {new Date(u.created_at).toLocaleDateString('en-GB')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {u.is_admin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e3f2fd] text-[#0088cc] rounded-md text-xs font-semibold">
                              <ShieldCheck size={12} /> Admin
                            </span>
                          ) : (
                            <span className="text-xs text-[#707579] font-medium">User</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 rounded-lg text-[#707579]">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center text-[#707579]">
                            <Search size={40} className="mb-3" />
                            <p className="font-medium text-sm">No users found</p>
                            <p className="text-xs mt-1">Try adjusting your search criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 bg-[#fafafa] border-t border-[#dfe1e5] flex items-center justify-between">
                <div className="text-xs text-[#707579]">
                  Showing <span className="font-semibold text-[#222222]">{allUsers.length}</span> users
                </div>
                <div className="flex gap-2">
                  <button disabled className="px-3 py-1.5 text-xs font-medium bg-white border border-[#dfe1e5] rounded-lg text-[#707579] opacity-50">
                    Previous
                  </button>
                  <button disabled className="px-3 py-1.5 text-xs font-medium bg-white border border-[#dfe1e5] rounded-lg text-[#707579] opacity-50">
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-in-out transform
        ${active
          ? 'bg-[#0088cc] text-white shadow-sm scale-[0.98]'
          : 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#0088cc] active:scale-[0.98] hover:translate-x-1'
        }
        cursor-pointer
      `}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp = false,
  isAlert = false
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  isAlert?: boolean;
}) {
  return (
    <div className="bg-white border border-[#dfe1e5] rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${isAlert ? 'bg-[#ffebee]' : 'bg-[#f4f4f5]'}`}>
          <div className={isAlert ? 'text-[#e53935]' : 'text-[#0088cc]'}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`
            flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold
            ${trendUp ? 'bg-[#e8f5e9] text-[#31b545]' : 'bg-[#f4f4f5] text-[#707579]'}
          `}>
            {trendUp && <TrendingUp size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className={`text-3xl font-bold mb-1 ${isAlert ? 'text-[#e53935]' : 'text-[#222222]'}`}>
          {value}
        </div>
        <div className="text-xs font-medium text-[#707579] uppercase tracking-wide">
          {label}
        </div>
      </div>
    </div>
  );
}

// Plan Badge Component
function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: "bg-[#f4f4f5] text-[#707579]",
    starter: "bg-[#e8f5e9] text-[#31b545]",
    pro: "bg-[#e3f2fd] text-[#0088cc]",
    business: "bg-[#f3e5f5] text-[#7c3aed]",
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${styles[plan] || styles.free}`}>
      {plan}
    </span>
  );
}

// Access Denied Component
function AccessDenied({ email }: { email?: string }) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-10 border border-[#dfe1e5] text-center">
        <div className="w-16 h-16 bg-[#ffebee] rounded-full flex items-center justify-center text-[#e53935] mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-[#222222] mb-2">Access Restricted</h1>
        <p className="text-[#707579] text-sm mb-8 leading-relaxed">
          Your account <span className="font-semibold text-[#222222]">({email})</span> does not have administrator privileges to access this dashboard.
        </p>
        <div className="flex flex-col gap-3">
          <a href="/" className="bg-[#0088cc] text-white px-6 py-2.5 rounded-xl font-medium text-sm">
            Return to Homepage
          </a>
          <form action="/auth/signout" method="post">
            <button className="text-sm font-medium text-[#707579]">Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}