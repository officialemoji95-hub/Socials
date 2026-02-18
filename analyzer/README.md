# analyzer monorepo

`analyzer` is a TypeScript monorepo with:

- `apps/mobile`: React Native Expo app for account linking, campaign visibility, and contacts state tracking.
- `apps/api`: Node.js Express API for account management, polling social APIs, campaign invite queueing, and channel membership imports.

> **Important safety constraint:** this system does **not** send DMs. It only computes eligibility, marks contacts, and queues invite messages for future/manual delivery.

## Monorepo structure

```text
analyzer/
  apps/
    api/
    mobile/
```

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project (Postgres + Auth)
- Expo CLI (optional, via `npx expo`)

## Setup

1. Install dependencies from monorepo root:

   ```bash
   npm install
   ```

2. Copy environment files:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/mobile/.env.example apps/mobile/.env
   ```

3. Fill in Supabase and API credentials.

4. Run development services:

   ```bash
   npm run dev:api
   npm run dev:mobile
   ```

## Supabase SQL schema

Run this SQL in Supabase SQL editor. (If you already have schema objects, merge these definitions with your existing schema.)

```sql
create extension if not exists "pgcrypto";

create type platform_type as enum ('instagram', 'tiktok');
create type contact_state as enum ('opted_in', 'invited', 'joined', 'skipped', 'do_not_contact');
create type queue_status as enum ('queued', 'sent', 'failed');

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  platform platform_type not null,
  platform_account_id text not null,
  username text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, platform_account_id)
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  platform platform_type not null,
  external_post_id text not null,
  posted_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (platform, external_post_id)
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into campaigns (campaign_key, name)
values ('ig_channel_invite', 'Instagram Channel Invite')
on conflict (campaign_key) do nothing;

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  platform platform_type not null,
  platform_contact_id text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, platform_contact_id)
);

create table if not exists contact_states (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(id) on delete cascade,
  campaign_key text not null,
  state contact_state not null default 'opted_in',
  last_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contact_id, campaign_key)
);

create table if not exists invite_queue (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null,
  contact_id uuid not null references contacts(id) on delete cascade,
  message_body text not null,
  status queue_status not null default 'queued',
  queued_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'accounts_set_updated_at') then
    create trigger accounts_set_updated_at
    before update on accounts
    for each row execute function set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'contacts_set_updated_at') then
    create trigger contacts_set_updated_at
    before update on contacts
    for each row execute function set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'contact_states_set_updated_at') then
    create trigger contact_states_set_updated_at
    before update on contact_states
    for each row execute function set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'campaigns_set_updated_at') then
    create trigger campaigns_set_updated_at
    before update on campaigns
    for each row execute function set_updated_at();
  end if;
end $$;
```

## API overview (`apps/api`)

### Endpoints

- `GET /health`
- `GET /accounts`
- `POST /accounts`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`
- `POST /poll/instagram`
- `POST /poll/tiktok`
- `POST /campaigns/invite`
- `POST /channels/import`
- `GET /contacts`

### Scheduler

`node-cron` runs Instagram and TikTok polling every 3 minutes (`*/3 * * * *`).

### Skip logic for campaign invite eligibility

A contact is skipped if:

- state is `joined`
- state is `skipped`
- state is `do_not_contact`
- state is `invited` and `last_action_at` is within 7 days

Eligible contacts are marked `invited` and added to `invite_queue` with status `queued`.

## Mobile overview (`apps/mobile`)

Screens:

- `LoginScreen`: OAuth placeholders + token paste inputs
- `DashboardScreen`: connected accounts + last detected post per platform
- `CampaignScreen`: invite trigger + counters (`opted_in`, `invited`, `joined`, `skipped`)
- `ContactsScreen`: searchable contacts list with state badges

The app uses the API base URL from env (`EXPO_PUBLIC_API_BASE_URL`).

## Local run commands

From root:

```bash
npm run dev:api
npm run dev:mobile
```

Per package:

```bash
npm run dev -w apps/api
npm run start -w apps/mobile
```
