-- =========================================================
-- MOODKE — Database Schema (PostgreSQL / Supabase)
-- =========================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================================
-- 1. PROFILES (extends auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('personal', 'business', 'admin')) default 'personal',
  full_name text,
  email text unique,
  phone text,
  avatar_url text,
  status text not null check (status in ('active', 'suspended')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);

-- =========================================================
-- 2. BUSINESSES (extra info pou biznis)
-- =========================================================
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  address text,
  city text not null,
  state_code char(2) not null,
  zip text,
  lat numeric(10,7),
  lng numeric(10,7),
  plan text not null check (plan in ('free', 'pro', 'premium')) default 'free',
  verified boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_businesses_owner on public.businesses(owner_id);
create index if not exists idx_businesses_state on public.businesses(state_code);
create index if not exists idx_businesses_plan on public.businesses(plan);

-- =========================================================
-- 3. CATEGORIES
-- =========================================================
create table if not exists public.categories (
  id serial primary key,
  name text unique not null,
  icon text,
  sort_order int default 0
);

-- =========================================================
-- 4. US STATES (52 — 50 + DC + PR)
-- =========================================================
create table if not exists public.us_states (
  code char(2) primary key,
  name text not null
);

-- =========================================================
-- 5. OFFERS
-- =========================================================
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  image_url text,
  vip boolean default false,
  city text not null,
  state_code char(2) not null,
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  ends_at timestamptz,
  status text not null check (status in ('active', 'paused', 'expired')) default 'active',
  views_count int default 0,
  saves_count int default 0,
  reservations_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_offers_business on public.offers(business_id);
create index if not exists idx_offers_state on public.offers(state_code);
create index if not exists idx_offers_city on public.offers(city);
create index if not exists idx_offers_category on public.offers(category);
create index if not exists idx_offers_status on public.offers(status);
create index if not exists idx_offers_created on public.offers(created_at desc);
create index if not exists idx_offers_location on public.offers(state_code, city);

-- =========================================================
-- 6. FAVORITES
-- =========================================================
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  offer_id uuid not null references public.offers(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, offer_id)
);

create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_favorites_offer on public.favorites(offer_id);

-- =========================================================
-- 7. RESERVATIONS
-- =========================================================
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  offer_id uuid not null references public.offers(id) on delete cascade,
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  amount numeric(10,2) not null,
  service_fee numeric(10,2) default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_reservations_user on public.reservations(user_id);
create index if not exists idx_reservations_offer on public.reservations(offer_id);
create index if not exists idx_reservations_status on public.reservations(status);

-- =========================================================
-- 8. TRIGGER: updated_at otomatik
-- =========================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_businesses_updated on public.businesses;
create trigger trg_businesses_updated before update on public.businesses
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_offers_updated on public.offers;
create trigger trg_offers_updated before update on public.offers
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_reservations_updated on public.reservations;
create trigger trg_reservations_updated before update on public.reservations
  for each row execute function public.handle_updated_at();

-- =========================================================
-- 9. TRIGGER: kreye profile otomatik lè yon user enskri
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'personal')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- 10. COUNTERS: ogmante saves_count ak reservations_count
-- =========================================================
create or replace function public.increment_saves()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.offers set saves_count = saves_count + 1 where id = new.offer_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.offers set saves_count = greatest(0, saves_count - 1) where id = old.offer_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_favorites_count on public.favorites;
create trigger trg_favorites_count
  after insert or delete on public.favorites
  for each row execute function public.increment_saves();

create or replace function public.increment_reservations()
returns trigger as $$
begin
  update public.offers set reservations_count = reservations_count + 1 where id = new.offer_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_reservations_count on public.reservations;
create trigger trg_reservations_count
  after insert on public.reservations
  for each row execute function public.increment_reservations();

-- =========================================================
-- 11. ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles    enable row level security;
alter table public.businesses  enable row level security;
alter table public.offers      enable row level security;
alter table public.favorites   enable row level security;
alter table public.reservations enable row level security;
alter table public.categories  enable row level security;
alter table public.us_states   enable row level security;

-- Helper: verifye si user se admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ---------- PROFILES ----------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- ---------- BUSINESSES ----------
drop policy if exists "businesses_select_all" on public.businesses;
create policy "businesses_select_all" on public.businesses
  for select using (true);

drop policy if exists "businesses_insert_own" on public.businesses;
create policy "businesses_insert_own" on public.businesses
  for insert with check (auth.uid() = owner_id);

drop policy if exists "businesses_update_own" on public.businesses;
create policy "businesses_update_own" on public.businesses
  for update using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "businesses_delete_own" on public.businesses;
create policy "businesses_delete_own" on public.businesses
  for delete using (auth.uid() = owner_id or public.is_admin());

-- ---------- OFFERS ----------
drop policy if exists "offers_select_active" on public.offers;
create policy "offers_select_active" on public.offers
  for select using (status = 'active' or auth.uid() in (
    select owner_id from public.businesses where id = business_id
  ) or public.is_admin());

drop policy if exists "offers_insert_owner" on public.offers;
create policy "offers_insert_owner" on public.offers
  for insert with check (
    exists (
      select 1 from public.businesses
      where id = business_id and owner_id = auth.uid()
    )
  );

drop policy if exists "offers_update_owner" on public.offers;
create policy "offers_update_owner" on public.offers
  for update using (
    exists (
      select 1 from public.businesses
      where id = business_id and owner_id = auth.uid()
    ) or public.is_admin()
  );

drop policy if exists "offers_delete_owner" on public.offers;
create policy "offers_delete_owner" on public.offers
  for delete using (
    exists (
      select 1 from public.businesses
      where id = business_id and owner_id = auth.uid()
    ) or public.is_admin()
  );

-- ---------- FAVORITES ----------
drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- ---------- RESERVATIONS ----------
drop policy if exists "reservations_select_own" on public.reservations;
create policy "reservations_select_own" on public.reservations
  for select using (
    auth.uid() = user_id
    or auth.uid() in (
      select b.owner_id
      from public.offers o
      join public.businesses b on b.id = o.business_id
      where o.id = offer_id
    )
    or public.is_admin()
  );

drop policy if exists "reservations_insert_own" on public.reservations;
create policy "reservations_insert_own" on public.reservations
  for insert with check (auth.uid() = user_id);

drop policy if exists "reservations_update_own" on public.reservations;
create policy "reservations_update_own" on public.reservations
  for update using (
    auth.uid() = user_id
    or auth.uid() in (
      select b.owner_id
      from public.offers o
      join public.businesses b on b.id = o.business_id
      where o.id = offer_id
    )
    or public.is_admin()
  );

-- ---------- CATEGORIES & STATES (public read) ----------
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories
  for select using (true);

drop policy if exists "us_states_select_all" on public.us_states;
create policy "us_states_select_all" on public.us_states
  for select using (true);

-- =========================================================
-- 12. SEED DATA
-- =========================================================

-- 52 states
insert into public.us_states (code, name) values
  ('AL','Alabama'),('AK','Alaska'),('AZ','Arizona'),('AR','Arkansas'),
  ('CA','California'),('CO','Colorado'),('CT','Connecticut'),('DE','Delaware'),
  ('DC','District of Columbia'),('FL','Florida'),('GA','Georgia'),('HI','Hawaii'),
  ('ID','Idaho'),('IL','Illinois'),('IN','Indiana'),('IA','Iowa'),
  ('KS','Kansas'),('KY','Kentucky'),('LA','Louisiana'),('ME','Maine'),
  ('MD','Maryland'),('MA','Massachusetts'),('MI','Michigan'),('MN','Minnesota'),
  ('MS','Mississippi'),('MO','Missouri'),('MT','Montana'),('NE','Nebraska'),
  ('NV','Nevada'),('NH','New Hampshire'),('NJ','New Jersey'),('NM','New Mexico'),
  ('NY','New York'),('NC','North Carolina'),('ND','North Dakota'),('OH','Ohio'),
  ('OK','Oklahoma'),('OR','Oregon'),('PA','Pennsylvania'),('PR','Puerto Rico'),
  ('RI','Rhode Island'),('SC','South Carolina'),('SD','South Dakota'),('TN','Tennessee'),
  ('TX','Texas'),('UT','Utah'),('VT','Vermont'),('VA','Virginia'),
  ('WA','Washington'),('WV','West Virginia'),('WI','Wisconsin'),('WY','Wyoming')
on conflict (code) do nothing;

-- Categories
insert into public.categories (name, icon, sort_order) values
  ('Food','🍽️',1),('Beauty','💇🏽‍♀️',2),('Fitness','🏋🏽',3),
  ('Events','🎉',4),('Shopping','🛍️',5),('Nightlife','🌙',6),
  ('Travel','✈️',7),('Family','👨‍👩‍👧',8),('Services','🛠️',9),
  ('Cafés','☕',10),('Wellness','🧘🏽‍♀️',11)
on conflict (name) do nothing;

-- =========================================================
-- 13. FINI
-- =========================================================
select 'Schema Moodke kreye ak siksè ✅' as status;