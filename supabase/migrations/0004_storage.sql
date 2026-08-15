-- Storage buckets:
--  cake-assets   -- admin-uploaded shading/slice/overlay source images
--                    shapes/{shapeId}/{view}-shading.png
--                    flavors/{flavorId}-slice.png
--                    designs/{designId}/{view}-overlay.png
--                 also order-attached print photos under prints/{orderItemId}.ext
--  cake-previews -- composited preview cache, written by the cake-preview
--                    edge function, keyed by the exact input combination.

insert into storage.buckets (id, name, public)
values ('cake-assets', 'cake-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cake-previews', 'cake-previews', true)
on conflict (id) do nothing;

-- Public read for both buckets (images are non-sensitive marketing/preview assets).
create policy cake_assets_public_read on storage.objects
  for select using (bucket_id = 'cake-assets');

create policy cake_previews_public_read on storage.objects
  for select using (bucket_id = 'cake-previews');

-- Only admins can upload/replace/delete source assets.
create policy cake_assets_admin_write on storage.objects
  for insert with check (bucket_id = 'cake-assets' and public.is_admin());

create policy cake_assets_admin_update on storage.objects
  for update using (bucket_id = 'cake-assets' and public.is_admin())
  with check (bucket_id = 'cake-assets' and public.is_admin());

create policy cake_assets_admin_delete on storage.objects
  for delete using (bucket_id = 'cake-assets' and public.is_admin());

-- Authenticated customers may upload a photo to print (order flow), under
-- prints/. The cake-preview edge function (service role) manages the rest
-- of cake-assets and all of cake-previews, bypassing RLS.
create policy cake_assets_customer_upload_print on storage.objects
  for insert with check (
    bucket_id = 'cake-assets'
    and (storage.foldername(name))[1] = 'prints'
    and auth.role() = 'authenticated'
  );
