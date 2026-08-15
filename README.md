# KutuKutu Cakes

Custom cake ordering platform MVP (Next.js + Supabase), with home/ready-made
catalog, a 5-step cake customizer with server-rendered live previews, cart,
checkout with a PCI-compliant hosted payment redirect (CIB/Edahabia via
SATIM), order confirmation, account, and an admin panel — all in Arabic,
English and French with automatic RTL for Arabic.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (Postgres + Row Level Security, Edge Functions, Storage)
- **State:** Zustand for the client-side cart

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project + SATIM credentials
npm run dev
```

### Supabase setup

1. Create a Supabase project.
2. Run the SQL files in `supabase/migrations/` in order (via the Supabase
   SQL editor, or `supabase db push` if you use the Supabase CLI).
3. Deploy the edge function: `supabase functions deploy cake-preview`.
4. Promote your own account to admin once you've signed up:
   `update public.users set role = 'admin' where id = '<your-auth-uid>';`
5. Populate the catalog tables (`shapes`, `flavors`, `colors`, `designs`,
   `addons`, `ready_made_cakes`) from `/admin`, then upload the matching
   images to the `cake-assets` bucket using the naming convention described
   in each admin form (e.g. `shapes/{shapeId}/front-shading.png`).

### Payment gateway (CIB / Edahabia)

Checkout integrates SATIM's hosted payment page (the shared gateway behind
both CIB and Edahabia cards in Algeria): the server registers the order with
SATIM, redirects the customer to SATIM's own hosted page to enter card
details, and only a success/failure callback + transaction reference come
back to us. Raw card data never touches this app. See
`src/app/api/payment/` for the integration points and fill in
`SATIM_MERCHANT_ID` / `SATIM_MERCHANT_PASSWORD` / `SATIM_TERMINAL_ID` in
`.env.local` once you have merchant credentials from SATIM.

## Project structure

```
src/
  app/[locale]/         routed pages (home, customize, cart, checkout, confirmation, account, admin)
  app/api/               server-only route handlers (payment callback, previews)
  components/<feature>/  small, focused components per page/feature
  lib/i18n/               dictionaries + RTL-aware translation context
  lib/supabase/           browser/server/service-role Supabase clients
  lib/store/              client state (cart)
  types/                  shared TypeScript types mirroring the DB schema
supabase/
  migrations/             SQL schema, RLS policies, storage buckets
  functions/cake-preview/ compositing edge function (Deno + @cf-wasm/photon)
```
