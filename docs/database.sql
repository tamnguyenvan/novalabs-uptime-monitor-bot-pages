-- ================================================================
-- PHẦN 1: ADMIN SYSTEM (Dành cho Dashboard)
-- ================================================================

-- 1. Tạo bảng Profiles (Chỉ dùng cho Admin/Staff đăng nhập Dashboard)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Trigger tự động tạo profile khi có user đăng ký (Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false); -- Mặc định là false, bạn cần update tay trong DB thành true
  return new;
end;
$$;

-- Xóa trigger cũ nếu tồn tại để tránh lỗi duplicate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Hàm kiểm tra quyền Admin (QUAN TRỌNG: Sửa lỗi function does not exist)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and is_admin = true
  );
$$ language sql security definer;

-- 4. RLS cho Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile" 
    on public.profiles for select using (auth.uid() = id);

create policy "Admins can view all profiles" 
    on public.profiles for select using (public.is_admin());

-- ================================================================
-- PHẦN 2: BOT USER SYSTEM (Khách hàng Telegram)
-- ================================================================

-- 5. Bảng Telegram Users (Khách hàng)
create table if not exists public.telegram_users (
    telegram_id bigint primary key,
    username text,
    first_name text,
    plan text default 'free' check (plan in ('free', 'pro', 'business')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Bảng Monitors
create table if not exists public.monitors (
    id uuid default gen_random_uuid() primary key,
    telegram_id bigint references public.telegram_users(telegram_id) on delete cascade not null,
    url text not null,
    status text default 'pending', -- up, down, pending
    http_code int default 0,
    is_active boolean default true, -- Soft delete
    last_checked_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Bảng Logs (Tùy chọn)
create table if not exists public.monitor_logs (
    id uuid default gen_random_uuid() primary key,
    monitor_id uuid references public.monitors(id) on delete cascade,
    status text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ================================================================
-- PHẦN 3: POLICIES CHO DASHBOARD (Sửa lỗi chính ở đây)
-- ================================================================

-- Enable RLS
alter table public.telegram_users enable row level security;
alter table public.monitors enable row level security;
alter table public.monitor_logs enable row level security;

-- Xóa policies cũ nếu có để tránh lỗi "policy already exists"
drop policy if exists "Admins view users" on public.telegram_users;
drop policy if exists "Admins view monitors" on public.monitors;
drop policy if exists "Admins view logs" on public.monitor_logs;

-- Tạo Policy: Chỉ Admin mới được xem dữ liệu này trên Dashboard
create policy "Admins view users" 
    on public.telegram_users for select using (public.is_admin());

create policy "Admins view monitors" 
    on public.monitors for select using (public.is_admin());

create policy "Admins view logs" 
    on public.monitor_logs for select using (public.is_admin());

-- Lưu ý: Bot Worker dùng Service Role Key nên sẽ tự động bypass các policy này (không cần policy cho bot).