-- Akshay DMS initial PostgreSQL schema
create extension if not exists "pgcrypto";

create type staff_role as enum ('owner', 'admin', 'sales', 'service', 'accountant');
create type vehicle_status as enum ('available', 'reserved', 'sold');
create type sale_status as enum ('draft', 'confirmed', 'delivered', 'cancelled');
create type service_status as enum ('scheduled', 'in_progress', 'completed', 'cancelled');

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'sales',
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  address text,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_phone_check check (phone ~ '^\+?[0-9]{7,15}$')
);

create unique index if not exists customers_phone_unique on public.customers(phone);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  chassis_number text not null,
  registration_number text,
  brand text not null,
  model text not null,
  variant text not null,
  year integer not null,
  color text,
  cost_price numeric(12,2) not null,
  selling_price numeric(12,2) not null,
  status vehicle_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicles_year_check check (year between 1900 and 2200),
  constraint vehicles_cost_check check (cost_price >= 0),
  constraint vehicles_price_check check (selling_price >= 0)
);

create unique index if not exists vehicles_chassis_unique on public.vehicles(chassis_number);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id),
  customer_id uuid not null references public.customers(id),
  staff_id uuid not null references public.staff_profiles(id),
  amount numeric(12,2) not null,
  status sale_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_amount_check check (amount >= 0)
);

create table if not exists public.service_jobs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id),
  customer_id uuid not null references public.customers(id),
  assigned_staff_id uuid references public.staff_profiles(id),
  description text not null,
  status service_status not null default 'scheduled',
  scheduled_at timestamptz,
  completed_at timestamptz,
  cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  constraint service_cost_check check (cost >= 0)
);

alter table public.staff_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.sales enable row level security;
alter table public.service_jobs enable row level security;

create policy staff_profile_read on public.staff_profiles
  for select using (auth.uid() is not null);

create policy staff_profile_update on public.staff_profiles
  for update using (auth.uid() = id);

create policy customers_authenticated on public.customers
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy vehicles_authenticated on public.vehicles
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy sales_authenticated on public.sales
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy service_authenticated on public.service_jobs
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);
