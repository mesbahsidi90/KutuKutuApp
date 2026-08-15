-- Row Level Security: public read-only access to active catalog rows,
-- admin-only writes, and per-user access to their own orders.
-- No client-side secret is required anywhere -- admin status is derived
-- server-side from public.users.role via auth.uid().

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- Catalog tables ------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array['shapes', 'flavors', 'colors', 'designs', 'addons', 'ready_made_cakes']
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format(
      'create policy %I on public.%I for select using (active = true or public.is_admin())',
      t || '_read', t
    );
    execute format(
      'create policy %I on public.%I for insert with check (public.is_admin())',
      t || '_insert', t
    );
    execute format(
      'create policy %I on public.%I for update using (public.is_admin()) with check (public.is_admin())',
      t || '_update', t
    );
    execute format(
      'create policy %I on public.%I for delete using (public.is_admin())',
      t || '_delete', t
    );
  end loop;
end $$;

-- Users -----------------------------------------------------------------

alter table public.users enable row level security;

create policy users_read_own on public.users
  for select using (id = auth.uid() or public.is_admin());

create policy users_update_own on public.users
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Orders ------------------------------------------------------------------

alter table public.orders enable row level security;

create policy orders_read_own on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

create policy orders_insert_own on public.orders
  for insert with check (user_id = auth.uid() or user_id is null);

create policy orders_update_admin_or_owner_status on public.orders
  for update using (public.is_admin() or user_id = auth.uid())
  with check (public.is_admin() or user_id = auth.uid());

-- Order items / addons follow their parent order's visibility.

alter table public.order_items enable row level security;

create policy order_items_read on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy order_items_insert on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

alter table public.order_addons enable row level security;

create policy order_addons_read on public.order_addons
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_addons.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy order_addons_insert on public.order_addons
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_addons.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );
