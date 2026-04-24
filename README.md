# EstateKit

Full-stack real estate platform with listings, property detail pages, authentication, an admin dashboard, and Supabase integration.

## Overview

EstateKit is a modern real estate application built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. It includes a public property browsing experience, protected admin tools, and a Supabase-backed data layer for listings, profiles, favorites, and approval workflows.

## Features

- Public marketing and property browsing pages
- Property listing filters for buy, rent, and sold inventory
- Detailed property pages with galleries, fees, amenities, schools, and nearby places
- Supabase authentication with user and admin roles
- Protected admin dashboard for managing listings, approvals, and users
- Server Actions for create, approve, delete, and role update flows
- Row Level Security-aware Supabase setup
- Jest + React Testing Library test suite

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- React Hook Form + Zod
- TanStack Query
- Jest + React Testing Library

## Project Structure

```text
app/
  (client)/           Public-facing pages
  (auth)/             Login and signup flows
  (admin)/            Protected admin dashboard
components/           Shared UI and layout components
features/             Domain-specific property and marketing modules
lib/supabase/         Supabase clients and auth helpers
supabase/migrations/  SQL migrations for auth, roles, and property details
__tests__/            Component, page, service, and action tests
tests/mocks/          Shared test fixtures and mock property data
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_PHONE=
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- Never expose the service role key with a `NEXT_PUBLIC_` prefix.
- `.env.local` should not be committed.

### 3. Apply Supabase migrations

Run these SQL files in order:

1. `supabase/migrations/202604210001_role_based_auth.sql`
2. `supabase/migrations/202604220001_property_detail_enrichment.sql`

You can apply them either:

- from the Supabase SQL Editor by pasting each file in order
- or with the Supabase CLI using `supabase db push`

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm test
```

## Authentication and Roles

EstateKit uses Supabase Auth and a `profiles` table with role-based access.

- `user`: can browse listings, save favorites, and submit listings for review
- `admin`: can access `/dashboard`, manage listings, review approvals, and update user roles

Protected admin routes are enforced on the server through `requireAdmin()`.

## Database Notes

The project expects Supabase tables and policies for:

- `profiles`
- `favorites`
- `properties`
- `property_amenities`
- `property_features`
- `property_fees`
- `property_pet_policies`
- `property_schools`
- `property_nearby_places`

The SQL migrations in `supabase/migrations/` enable RLS and set access policies for public, owner, and admin access patterns.

## Testing

This project includes:

- component tests
- page-level render tests
- service tests
- server action tests
- auth and protected route tests

Run the full suite:

```bash
npm test
```

Run lint checks:

```bash
npm run lint
```

Current coverage includes:

- property explorer filters and empty states
- property detail sections and no-data cases
- property detail page loading and metadata
- admin property list rendering
- new property form validation and submit behavior
- Supabase-backed property services
- admin server actions
- auth redirect helpers and protected admin layout

## Deployment

Before deploying:

1. Add all required environment variables
2. Apply Supabase migrations to the target database
3. Verify `npm test` passes
4. Verify `npm run lint` passes
5. Confirm no secret files are staged for commit

Build for production with:

```bash
npm run build
```

## Security Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` out of Git
- Use the provided SQL migrations so RLS policies are applied correctly
- Admin-only actions rely on server-side role checks
- Public property data is scoped through approved listing access patterns

