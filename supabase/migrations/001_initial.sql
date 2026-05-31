-- ============================================================
-- CHEFINHO FIT — Estrutura do Banco de Dados
-- Cole este SQL no Supabase → SQL Editor → New query → Run
-- ============================================================

-- Habilitar extensão de UUID
create extension if not exists "uuid-ossp";

-- ── Perfis de usuário ─────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default 'Chefinho',
  role text not null default 'parent' check (role in ('parent', 'child')),
  avatar_url text,
  total_points integer not null default 0,
  weekly_points integer not null default 0,
  level text not null default 'Aprendiz',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Usuário vê só seu perfil" on profiles
  for all using (auth.uid() = id);

-- Criar perfil automaticamente ao registrar
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', 'Chefinho'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Perfis das crianças ───────────────────────────────────────
create table if not exists children (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  age integer not null,
  sex text not null default 'M',
  weight_kg numeric not null,
  height_cm numeric not null,
  meals_per_day integer not null default 5,
  meal_schedule text[] not null default '{}',
  activity_level text not null default 'moderado',
  gut_health text not null default 'normal',
  allergies text[] not null default '{}',
  food_preferences text[] not null default '{}',
  food_dislikes text[] not null default '{}',
  cookware text[] not null default '{}',
  pantry_raw text not null default '',
  pantry_parsed jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table children enable row level security;
create policy "Dono vê seus filhos" on children
  for all using (auth.uid() = owner_id);

-- ── Cardápios semanais ────────────────────────────────────────
create table if not exists meal_plans (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  week_start date not null,
  days jsonb not null default '[]',
  goals jsonb not null default '[]',
  generated_at timestamptz not null default now()
);

alter table meal_plans enable row level security;
create policy "Dono vê seus cardápios" on meal_plans
  for all using (auth.uid() = owner_id);

-- ── Receitas descobertas ──────────────────────────────────────
create table if not exists recipes (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  emoji text not null default '🍳',
  ingredients text[] not null default '{}',
  instructions text[] not null default '{}',
  nutrition_summary text,
  battle_card jsonb,
  discovered_at timestamptz not null default now()
);

alter table recipes enable row level security;
create policy "Dono vê suas receitas" on recipes
  for all using (auth.uid() = owner_id);

-- ── Resultado de batalhas ─────────────────────────────────────
create table if not exists battle_results (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  outcome text not null check (outcome in ('victory', 'defeat', 'draw')),
  points_gained integer not null default 0,
  rounds jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table battle_results enable row level security;
create policy "Dono vê suas batalhas" on battle_results
  for all using (auth.uid() = owner_id);

-- ── Missões ───────────────────────────────────────────────────
create table if not exists missions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  type text not null,
  target_value integer not null default 1,
  current_value integer not null default 0,
  point_reward integer not null default 20,
  expires_at timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table missions enable row level security;
create policy "Dono vê suas missões" on missions
  for all using (auth.uid() = owner_id);

-- ── Ranking semanal (view pública) ───────────────────────────
create or replace view ranking_semanal as
  select
    id,
    display_name,
    level,
    weekly_points,
    rank() over (order by weekly_points desc) as rank
  from profiles
  order by weekly_points desc
  limit 50;
