-- Users profile table (1:1 with auth.users), orders, order_items, order_addons.

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  preferred_locale text not null default 'ar' check (preferred_locale in ('ar', 'en', 'fr')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a public.users row whenever a new auth user signs up.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.users(id),
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')
  ),
  currency text not null default 'DZD',
  subtotal numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  order_message text, -- free-text message attached to the whole order
  recipient_name text not null,
  recipient_phone text not null,
  recipient_address text not null,
  recipient_city text not null,
  recipient_lat double precision,
  recipient_lng double precision,
  hide_identity boolean not null default false,
  note_to_store text,
  payment_method text check (payment_method in ('cib', 'edahabia')),
  payment_status text not null default 'pending' check (
    payment_status in ('pending', 'paid', 'failed', 'refunded')
  ),
  payment_reference text, -- gateway transaction reference/token, never card data
  estimated_delivery_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  shape_id uuid not null references public.shapes(id),
  flavor_id uuid not null references public.flavors(id),
  color_hex text not null check (color_hex ~* '^#[0-9a-f]{6}$'),
  design_id uuid references public.designs(id),
  message_text text check (char_length(message_text) <= 40),
  photo_print_url text, -- uploaded photo to print on the cake
  photo_print_fee numeric(10, 2) not null default 0,
  additional_instructions text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) not null,
  preview_front_url text,
  preview_top_url text,
  preview_sliced_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

create table if not exists public.order_addons (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  addon_id uuid not null references public.addons(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_addons_order_id on public.order_addons(order_id);
