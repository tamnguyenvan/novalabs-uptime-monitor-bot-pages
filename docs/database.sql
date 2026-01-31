-- TABLES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  telegram_id text unique,
  username text,
  is_admin boolean default false,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.monitors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  name text,
  status text default 'pending' check (status in ('up', 'down', 'pending')),
  last_checked timestamp with time zone,
  check_interval_seconds integer default 300,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.monitors enable row level security;

-- POLICIES
-- Profiles: Users can see their own, Admins can see all
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Monitors: Users can manage own, Admins can see all
create policy "Users can manage own monitors" on public.monitors for all using (auth.uid() = user_id);
create policy "Admins can view all monitors" on public.monitors for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);