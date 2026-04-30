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
  default_tone text not null default 'professionnel'
    check (default_tone in ('professionnel', 'court', 'chaleureux', 'ferme', 'commercial')),
  default_language text not null default 'fr'
    check (default_language in ('fr', 'en', 'es')),
  data_retention_days integer not null default 30 check (data_retention_days in (30, 90, 180, 365)),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text check (plan in ('essential', 'pro')),
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

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_check;

alter table public.subscriptions
  add constraint subscriptions_plan_check
  check (plan in ('essential', 'pro'));

create table if not exists public.reply_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'manual'
    check (source in ('gmail', 'whatsapp_web', 'linkedin', 'outlook_web', 'manual')),
  mode text not null default 'generate'
    check (mode in ('generate', 'rewrite')),
  tone text not null default 'professionnel'
    check (tone in ('professionnel', 'court', 'chaleureux', 'ferme', 'commercial')),
  language text not null default 'fr'
    check (language in ('fr', 'en', 'es')),
  context_preview text,
  instruction text not null,
  generated_reply text,
  status text not null default 'completed' check (status in ('completed', 'blocked', 'error')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  quantity integer not null default 1 check (quantity > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reply_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'custom',
  instruction text not null,
  tone text not null default 'professionnel',
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.extension_installations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  browser text not null default 'chrome',
  extension_version text,
  label text not null default 'Chrome local',
  token_prefix text,
  install_token_hash text,
  revoked_at timestamptz,
  last_seen_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.extension_installations
  add column if not exists label text not null default 'Chrome local';

alter table public.extension_installations
  add column if not exists token_prefix text;

alter table public.extension_installations
  add column if not exists install_token_hash text;

alter table public.extension_installations
  add column if not exists revoked_at timestamptz;

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists reply_requests_user_created_idx on public.reply_requests(user_id, created_at desc);
drop index if exists reply_requests_user_month_idx;
create index if not exists reply_requests_user_usage_idx on public.reply_requests(user_id, created_at);
create index if not exists usage_events_user_created_idx on public.usage_events(user_id, created_at desc);
create index if not exists reply_templates_user_idx on public.reply_templates(user_id, category);
create unique index if not exists reply_templates_shared_unique_idx
  on public.reply_templates(name, category)
  where user_id is null;
create index if not exists extension_installations_user_seen_idx
  on public.extension_installations(user_id, last_seen_at desc);
create unique index if not exists extension_installations_token_hash_idx
  on public.extension_installations(install_token_hash)
  where install_token_hash is not null and revoked_at is null;

drop trigger if exists users_profiles_set_updated_at on public.users_profiles;
create trigger users_profiles_set_updated_at
before update on public.users_profiles
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists reply_requests_set_updated_at on public.reply_requests;
create trigger reply_requests_set_updated_at
before update on public.reply_requests
for each row execute function public.set_updated_at();

drop trigger if exists reply_templates_set_updated_at on public.reply_templates;
create trigger reply_templates_set_updated_at
before update on public.reply_templates
for each row execute function public.set_updated_at();

drop trigger if exists extension_installations_set_updated_at on public.extension_installations;
create trigger extension_installations_set_updated_at
before update on public.extension_installations
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
alter table public.reply_requests enable row level security;
alter table public.usage_events enable row level security;
alter table public.reply_templates enable row level security;
alter table public.extension_installations enable row level security;

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

drop policy if exists "Reply requests are readable by owner" on public.reply_requests;
create policy "Reply requests are readable by owner"
on public.reply_requests for select
using (auth.uid() = user_id);

drop policy if exists "Reply requests are insertable by owner" on public.reply_requests;
create policy "Reply requests are insertable by owner"
on public.reply_requests for insert
with check (auth.uid() = user_id);

drop policy if exists "Usage events are readable by owner" on public.usage_events;
create policy "Usage events are readable by owner"
on public.usage_events for select
using (auth.uid() = user_id);

drop policy if exists "Usage events are insertable by owner" on public.usage_events;
create policy "Usage events are insertable by owner"
on public.usage_events for insert
with check (auth.uid() = user_id);

drop policy if exists "Reply templates are readable by owner" on public.reply_templates;
create policy "Reply templates are readable by owner"
on public.reply_templates for select
using (auth.uid() = user_id or is_shared = true);

drop policy if exists "Reply templates are insertable by owner" on public.reply_templates;
create policy "Reply templates are insertable by owner"
on public.reply_templates for insert
with check (auth.uid() = user_id);

drop policy if exists "Reply templates are updatable by owner" on public.reply_templates;
create policy "Reply templates are updatable by owner"
on public.reply_templates for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Extension installations are readable by owner" on public.extension_installations;
create policy "Extension installations are readable by owner"
on public.extension_installations for select
using (auth.uid() = user_id);

drop policy if exists "Extension installations are insertable by owner" on public.extension_installations;
create policy "Extension installations are insertable by owner"
on public.extension_installations for insert
with check (auth.uid() = user_id);

drop policy if exists "Extension installations are updatable by owner" on public.extension_installations;
create policy "Extension installations are updatable by owner"
on public.extension_installations for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into public.reply_templates (user_id, name, category, instruction, tone, is_shared)
values
  (null, 'Relance client', 'sales', 'Relancer gentiment un client sans paraitre insistant.', 'professionnel', true),
  (null, 'Objection prix', 'sales', 'Repondre a une objection prix en restant ferme et cordial.', 'commercial', true),
  (null, 'Refus poli', 'client', 'Refuser une demande clairement avec une formulation respectueuse.', 'professionnel', true),
  (null, 'Disponibilite', 'planning', 'Proposer un creneau ou confirmer une disponibilite simplement.', 'court', true)
on conflict do nothing;
