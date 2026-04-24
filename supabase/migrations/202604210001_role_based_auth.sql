-- Role-based auth foundation for EstateKit.
-- Run this in Supabase SQL editor or through the Supabase CLI.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id bigint not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

alter table public.properties
  add column if not exists owner_id uuid references auth.users(id) on delete set null,
  add column if not exists approval_status text not null default 'approved'
    check (approval_status in ('pending', 'approved', 'rejected'));

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_property_id_idx on public.favorites(property_id);
create index if not exists properties_owner_id_idx on public.properties(owner_id);
create index if not exists properties_approval_status_idx on public.properties(approval_status);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.properties enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their basic profile" on public.profiles;
create policy "Users can update their basic profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = 'user');

drop policy if exists "Favorites are readable by owner or admin" on public.favorites;
create policy "Favorites are readable by owner or admin"
on public.favorites
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can create their favorites" on public.favorites;
create policy "Users can create their favorites"
on public.favorites
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can delete their favorites" on public.favorites;
create policy "Users can delete their favorites"
on public.favorites
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Allow public read approved properties" on public.properties;
create policy "Allow public read approved properties"
on public.properties
for select
to public
using (approval_status = 'approved');

drop policy if exists "Users can create pending properties" on public.properties;
create policy "Users can create pending properties"
on public.properties
for insert
to authenticated
with check (owner_id = auth.uid() and approval_status = 'pending');

drop policy if exists "Users can read their own submitted properties" on public.properties;
create policy "Users can read their own submitted properties"
on public.properties
for select
to authenticated
using (owner_id = auth.uid() or approval_status = 'approved' or public.is_admin());

drop policy if exists "Users can update their pending properties" on public.properties;
create policy "Users can update their pending properties"
on public.properties
for update
to authenticated
using (owner_id = auth.uid() and approval_status = 'pending')
with check (owner_id = auth.uid() and approval_status = 'pending');

drop policy if exists "Users can delete their pending properties" on public.properties;
create policy "Users can delete their pending properties"
on public.properties
for delete
to authenticated
using (owner_id = auth.uid() and approval_status = 'pending');

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();
