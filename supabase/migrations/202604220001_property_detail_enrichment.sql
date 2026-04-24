-- Property detail enrichment for EstateKit.
-- Run this after the role-based auth migration.

alter table public.properties
  add column if not exists listing_type text default 'sale'
    check (listing_type in ('sale', 'rent', 'sold')),
  add column if not exists home_type text default 'house'
    check (
      home_type in (
        'apartment',
        'house',
        'condo',
        'townhome',
        'multi_family',
        'land',
        'manufactured'
      )
    ),
  add column if not exists availability_label text,
  add column if not exists last_updated_at timestamptz default now(),
  add column if not exists broker_name text,
  add column if not exists agent_name text,
  add column if not exists virtual_tour_url text,
  add column if not exists is_pet_friendly boolean default false,
  add column if not exists has_parking boolean default false,
  add column if not exists has_pool boolean default false,
  add column if not exists has_gym boolean default false,
  add column if not exists has_laundry boolean default false,
  add column if not exists hoa_fee integer,
  add column if not exists property_tax_annual integer,
  add column if not exists application_fee integer,
  add column if not exists security_deposit integer,
  add column if not exists pet_deposit integer,
  add column if not exists pet_rent integer,
  add column if not exists lease_term_months integer,
  add column if not exists utilities_included text[] default '{}',
  add column if not exists amenities text[] default '{}',
  add column if not exists features text[] default '{}',
  add column if not exists pet_policies text[] default '{}',
  add column if not exists schools jsonb default '[]'::jsonb,
  add column if not exists nearby_places jsonb default '[]'::jsonb;

update public.properties
set listing_type = case
  when type = 'rent' then 'rent'
  when type = 'sold' then 'sold'
  else 'sale'
end
where listing_type is null;

create index if not exists properties_listing_type_idx on public.properties(listing_type);
create index if not exists properties_home_type_idx on public.properties(home_type);

create table if not exists public.property_amenities (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  label text not null,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists public.property_features (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  label text not null,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists public.property_fees (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  label text not null,
  amount integer,
  cadence text,
  created_at timestamptz not null default now()
);

create table if not exists public.property_pet_policies (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  label text not null,
  amount integer,
  created_at timestamptz not null default now()
);

create table if not exists public.property_schools (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  name text not null,
  rating integer,
  distance text,
  level text,
  students integer,
  created_at timestamptz not null default now()
);

create table if not exists public.property_nearby_places (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  name text not null,
  category text not null,
  distance text,
  created_at timestamptz not null default now()
);

alter table public.property_amenities enable row level security;
alter table public.property_features enable row level security;
alter table public.property_fees enable row level security;
alter table public.property_pet_policies enable row level security;
alter table public.property_schools enable row level security;
alter table public.property_nearby_places enable row level security;

drop policy if exists "Allow public read property_amenities" on public.property_amenities;
create policy "Allow public read property_amenities"
on public.property_amenities
for select
to public
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_amenities.property_id
      and (
        properties.approval_status = 'approved'
        or properties.owner_id = auth.uid()
        or public.is_admin()
      )
  )
);

drop policy if exists "Allow public read property_features" on public.property_features;
create policy "Allow public read property_features"
on public.property_features
for select
to public
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_features.property_id
      and (
        properties.approval_status = 'approved'
        or properties.owner_id = auth.uid()
        or public.is_admin()
      )
  )
);

drop policy if exists "Allow public read property_fees" on public.property_fees;
create policy "Allow public read property_fees"
on public.property_fees
for select
to public
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_fees.property_id
      and (
        properties.approval_status = 'approved'
        or properties.owner_id = auth.uid()
        or public.is_admin()
      )
  )
);

drop policy if exists "Allow public read property_pet_policies" on public.property_pet_policies;
create policy "Allow public read property_pet_policies"
on public.property_pet_policies
for select
to public
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_pet_policies.property_id
      and (
        properties.approval_status = 'approved'
        or properties.owner_id = auth.uid()
        or public.is_admin()
      )
  )
);

drop policy if exists "Allow public read property_schools" on public.property_schools;
create policy "Allow public read property_schools"
on public.property_schools
for select
to public
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_schools.property_id
      and (
        properties.approval_status = 'approved'
        or properties.owner_id = auth.uid()
        or public.is_admin()
      )
  )
);

drop policy if exists "Allow public read property_nearby_places" on public.property_nearby_places;
create policy "Allow public read property_nearby_places"
on public.property_nearby_places
for select
to public
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_nearby_places.property_id
      and (
        properties.approval_status = 'approved'
        or properties.owner_id = auth.uid()
        or public.is_admin()
      )
  )
);
