-- ==========================================
-- 1. SETUP EXTENSIONS & CLEANUP
-- ==========================================
create extension if not exists "pgcrypto";

-- Xóa các bảng cũ để làm sạch (Cẩn thận: Mất dữ liệu cũ)
drop table if exists public.incidents cascade;
drop table if exists public.monitors cascade;
drop table if exists public.profiles cascade;

-- ==========================================
-- 2. TABLES DEFINITION
-- ==========================================

-- Bảng Profiles: Lưu trữ thông tin người dùng mở rộng
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text,
  email text,
  avatar_url text,
  telegram_id text unique,
  is_admin boolean default false,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'business')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Monitors: Lưu trữ các mục tiêu cần theo dõi
create table public.monitors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  url text not null,
  status text default 'pending' check (status in ('up', 'down', 'pending', 'paused')),
  check_interval_seconds integer default 300 check (check_interval_seconds >= 15),
  last_checked_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Incidents: Lưu lịch sử downtime (Dùng cho biểu đồ/báo cáo)
create table public.incidents (
  id uuid default gen_random_uuid() primary key,
  monitor_id uuid references public.monitors(id) on delete cascade not null,
  status text not null, -- 'down' hoặc 'up'
  error_message text,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

-- ==========================================
-- 3. INDEXES (Tối ưu tốc độ truy vấn)
-- ==========================================
create index idx_monitors_user_id on public.monitors(user_id);
create index idx_monitors_status on public.monitors(status);
create index idx_profiles_is_admin on public.profiles(is_admin);
create index idx_incidents_monitor_id on public.incidents(monitor_id);

-- ==========================================
-- 4. AUTOMATION (TRIGGERS)
-- ==========================================

-- Hàm tự động tạo Profile khi có User đăng ký mới
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, is_admin, plan)
  values (
    new.id,
    split_part(new.email, '@', 1),
    new.email,
    false, -- Mặc định không phải admin
    'free'
  );
  return new;
end;
$$;

-- Trigger chạy sau khi User xác nhận email/đăng ký thành công
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table public.profiles enable row level security;
alter table public.monitors enable row level security;
alter table public.incidents enable row level security;

-- CHÍNH SÁCH CHO PROFILES
-- Người dùng bình thường chỉ thấy chính mình
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Admin được quyền xem tất cả (Dùng hàm kiểm tra để tránh đệ quy)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and is_admin = true
  );
$$ language sql security definer;

create policy "Admins can view all profiles"
  on public.profiles for select
  using ( public.is_admin() );

-- CHÍNH SÁCH CHO MONITORS
-- User quản lý monitor của mình
create policy "Users can manage own monitors"
  on public.monitors for all
  using ( auth.uid() = user_id );

-- Admin xem được tất cả monitors (nhưng không được sửa của user khác)
create policy "Admins can view all monitors"
  on public.monitors for select
  using ( public.is_admin() );

-- CHÍNH SÁCH CHO INCIDENTS
create policy "Users can view own incidents"
  on public.incidents for select
  using (
    exists (
      select 1 from public.monitors
      where id = public.incidents.monitor_id
      and user_id = auth.uid()
    )
  );

-- ==========================================
-- 6. HELPER FUNCTIONS
-- ==========================================

-- Cập nhật timestamp 'updated_at' tự động
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute procedure update_updated_at_column();