create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  timezone text not null default 'Europe/Paris',
  require_confirmations boolean not null default true,
  data_retention_days integer not null default 90 check (data_retention_days in (30, 90, 180, 365)),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text check (plan in ('starter', 'pro', 'business')),
  status text not null default 'incomplete',
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.google_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  google_email text,
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  expires_at timestamptz,
  scopes text,
  gmail_connected boolean not null default false,
  calendar_connected boolean not null default false,
  last_connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  phone_number text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone_number text not null,
  direction text not null check (direction in ('incoming', 'outgoing')),
  body text not null,
  external_message_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null default 'whatsapp',
  input text not null,
  intent text,
  output text,
  status text not null default 'processing' check (status in ('processing', 'completed', 'blocked', 'error')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pending_confirmations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'expired')),
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.action_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null,
  status text not null default 'success' check (status in ('success', 'error', 'blocked')),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists google_connections_user_id_idx on public.google_connections(user_id);
create index if not exists whatsapp_connections_phone_idx on public.whatsapp_connections(phone_number);
create index if not exists whatsapp_messages_user_created_idx on public.whatsapp_messages(user_id, created_at desc);
create unique index if not exists whatsapp_messages_external_message_id_idx
  on public.whatsapp_messages(external_message_id)
  where external_message_id is not null;
create index if not exists agent_requests_user_created_idx on public.agent_requests(user_id, created_at desc);
create index if not exists pending_confirmations_user_status_idx
  on public.pending_confirmations(user_id, status, expires_at);
create index if not exists action_logs_user_created_idx on public.action_logs(user_id, created_at desc);

drop trigger if exists users_profiles_set_updated_at on public.users_profiles;
create trigger users_profiles_set_updated_at
before update on public.users_profiles
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists google_connections_set_updated_at on public.google_connections;
create trigger google_connections_set_updated_at
before update on public.google_connections
for each row execute function public.set_updated_at();

drop trigger if exists whatsapp_connections_set_updated_at on public.whatsapp_connections;
create trigger whatsapp_connections_set_updated_at
before update on public.whatsapp_connections
for each row execute function public.set_updated_at();

drop trigger if exists agent_requests_set_updated_at on public.agent_requests;
create trigger agent_requests_set_updated_at
before update on public.agent_requests
for each row execute function public.set_updated_at();

drop trigger if exists pending_confirmations_set_updated_at on public.pending_confirmations;
create trigger pending_confirmations_set_updated_at
before update on public.pending_confirmations
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users_profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.google_connections enable row level security;
alter table public.whatsapp_connections enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.agent_requests enable row level security;
alter table public.pending_confirmations enable row level security;
alter table public.action_logs enable row level security;

drop policy if exists "Profiles are readable by owner" on public.users_profiles;
create policy "Profiles are readable by owner"
on public.users_profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.users_profiles;
create policy "Profiles are insertable by owner"
on public.users_profiles for insert
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.users_profiles;
create policy "Profiles are updatable by owner"
on public.users_profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Subscriptions are readable by owner" on public.subscriptions;
create policy "Subscriptions are readable by owner"
on public.subscriptions for select
using (auth.uid() = user_id);

drop policy if exists "Google connections are readable by owner" on public.google_connections;
create policy "Google connections are readable by owner"
on public.google_connections for select
using (auth.uid() = user_id);

drop policy if exists "WhatsApp connections are readable by owner" on public.whatsapp_connections;
create policy "WhatsApp connections are readable by owner"
on public.whatsapp_connections for select
using (auth.uid() = user_id);

drop policy if exists "WhatsApp connections are insertable by owner" on public.whatsapp_connections;
create policy "WhatsApp connections are insertable by owner"
on public.whatsapp_connections for insert
with check (auth.uid() = user_id);

drop policy if exists "WhatsApp connections are updatable by owner" on public.whatsapp_connections;
create policy "WhatsApp connections are updatable by owner"
on public.whatsapp_connections for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "WhatsApp messages are readable by owner" on public.whatsapp_messages;
create policy "WhatsApp messages are readable by owner"
on public.whatsapp_messages for select
using (auth.uid() = user_id);

drop policy if exists "Agent requests are readable by owner" on public.agent_requests;
create policy "Agent requests are readable by owner"
on public.agent_requests for select
using (auth.uid() = user_id);

drop policy if exists "Pending confirmations are readable by owner" on public.pending_confirmations;
create policy "Pending confirmations are readable by owner"
on public.pending_confirmations for select
using (auth.uid() = user_id);

drop policy if exists "Action logs are readable by owner" on public.action_logs;
create policy "Action logs are readable by owner"
on public.action_logs for select
using (auth.uid() = user_id);
