-- Catalog tables: shapes, flavors, colors, designs, addons, ready_made_cakes
-- All catalog tables use UUIDs as primary keys and expose name_ar/name_en/name_fr
-- for the app's Arabic/English/French i18n.

create extension if not exists "pgcrypto";

create table if not exists public.shapes (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  name_fr text not null,
  servings_range text not null, -- e.g. "8-10"
  weight_kg numeric(5, 2) not null,
  base_price numeric(10, 2) not null,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flavors (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  name_fr text not null,
  description_ar text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  extra_price numeric(10, 2) not null default 0,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.colors (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  name_fr text not null,
  hex text not null check (hex ~* '^#[0-9a-f]{6}$'),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  category text not null, -- e.g. retro, birthday, graduation, love, ramadan
  name_ar text not null,
  name_en text not null,
  name_fr text not null,
  extra_price numeric(10, 2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('candle', 'card', 'topper')),
  name_ar text not null,
  name_en text not null,
  name_fr text not null,
  price numeric(10, 2) not null default 0,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ready-made cake presets shown on the home page. Not in the original table
-- list but required to back "Ready-made cakes catalog grouped by category"
-- (section 2) -- each preset just points at a shape/flavor/color/design
-- combination so tapping it can pre-fill the customization flow.
create table if not exists public.ready_made_cakes (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name_ar text not null,
  name_en text not null,
  name_fr text not null,
  description_ar text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  image_url text,
  price numeric(10, 2) not null,
  shape_id uuid not null references public.shapes(id),
  flavor_id uuid not null references public.flavors(id),
  color_hex text not null check (color_hex ~* '^#[0-9a-f]{6}$'),
  design_id uuid references public.designs(id),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_designs_category on public.designs(category);
create index if not exists idx_ready_made_cakes_category on public.ready_made_cakes(category);
