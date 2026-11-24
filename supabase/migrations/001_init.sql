-- You Matter: schema + Row Level Security
-- Run in Supabase Dashboard > SQL Editor (or `supabase db push`).

create extension if not exists pgcrypto;

-- ---------- profiles (public pen-name info only; email stays in auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pen_name text not null check (char_length(pen_name) between 1 and 40),
  avatar_sticker text not null default '🌸' check (char_length(avatar_sticker) <= 16),
  signature text not null default '' check (char_length(signature) <= 80),
  bio text check (char_length(bio) <= 300),
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare pn text := left(coalesce(nullif(trim(new.raw_user_meta_data->>'pen_name'), ''), 'Friend'), 40);
begin
  insert into public.profiles (id, pen_name, avatar_sticker, signature)
  values (
    new.id, pn,
    left(coalesce(nullif(new.raw_user_meta_data->>'avatar_sticker', ''), '🌸'), 16),
    left(coalesce(nullif(new.raw_user_meta_data->>'signature', ''), '- ' || pn), 80)
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- journals ----------
create table public.journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  month_label text not null default 'Late Night Reflection' check (char_length(month_label) <= 60),
  is_public boolean not null default true,
  is_hidden boolean not null default false,            -- set by moderators
  mood text not null default 'holding-on' check (mood in
    ('heavy-hearted','overwhelmed','numb','holding-on','tender','seeking-light','grieving','hopeful')),
  reflection_body text not null default '' check (char_length(reflection_body) <= 5000),
  current_struggle text not null default '' check (char_length(current_struggle) <= 3000),
  coping_mechanism text not null default '' check (char_length(coping_mechanism) <= 3000),
  advice_wanted text not null default '' check (char_length(advice_wanted) <= 3000),
  steps_taking text[] not null default '{}' check (cardinality(steps_taking) <= 20),
  small_wins text[] not null default '{}' check (cardinality(small_wins) <= 20),
  featured_quote jsonb check (pg_column_size(featured_quote) <= 4000),
  snapshots jsonb check (pg_column_size(snapshots) <= 8000),
  watched_media jsonb check (pg_column_size(watched_media) <= 8000),
  reading_items jsonb check (pg_column_size(reading_items) <= 8000),
  listening_to jsonb check (pg_column_size(listening_to) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index journals_feed_idx on public.journals (created_at desc) where is_public and not is_hidden;
create index journals_user_idx on public.journals (user_id, created_at desc);

-- ---------- comments (inserted ONLY by the server after AI moderation) ----------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  journal_id uuid not null references public.journals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1500),
  ai_moderation jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index comments_journal_idx on public.comments (journal_id, created_at);
create index comments_user_idx on public.comments (user_id, created_at desc);

-- ---------- reactions (one per user per journal) ----------
create table public.reactions (
  journal_id uuid not null references public.journals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null check (emoji in ('🤍','🫂','🕯️','🌱','✨')),
  created_at timestamptz not null default now(),
  primary key (journal_id, user_id)
);

-- ---------- per-user coping-step progress + custom steps ----------
create table public.user_steps (
  user_id uuid not null references public.profiles(id) on delete cascade,
  step_id text not null check (char_length(step_id) <= 80),
  completed boolean not null default false,
  completed_at timestamptz,
  reflection_note text check (char_length(reflection_note) <= 1000),
  is_custom boolean not null default false,
  phase text check (phase in ('emergency','ground','breathe','gentle','action','anchor')),
  title text check (char_length(title) <= 200),
  subtitle text check (char_length(subtitle) <= 200),
  detail text check (char_length(detail) <= 1500),
  time_estimate text check (char_length(time_estimate) <= 30),
  icon_name text check (char_length(icon_name) <= 40),
  created_at timestamptz not null default now(),
  primary key (user_id, step_id)
);

-- ---------- reports (users flag harmful posts/comments) ----------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('journal','comment')),
  target_id uuid not null,
  reason text check (char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

-- ---------- abuse limits enforced in the database (work across serverless instances) ----------
create or replace function public.limit_journals() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.journals where user_id = new.user_id and created_at > now() - interval '1 day') >= 15 then
    raise exception 'Daily journal limit reached. Please try again tomorrow.' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger journals_rate_limit before insert on public.journals for each row execute function public.limit_journals();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger journals_touch before update on public.journals for each row execute function public.touch_updated_at();

-- Users may not change moderator-controlled columns.
create or replace function public.protect_journal_columns() returns trigger language plpgsql as $$
begin
  if new.is_hidden is distinct from old.is_hidden and auth.role() <> 'service_role' then
    raise exception 'Not allowed'; end if;
  if new.user_id is distinct from old.user_id then raise exception 'Not allowed'; end if;
  return new;
end $$;
create trigger journals_protect before update on public.journals for each row execute function public.protect_journal_columns();

create or replace function public.protect_profile_columns() returns trigger language plpgsql as $$
begin
  if new.is_banned is distinct from old.is_banned and auth.role() <> 'service_role' then
    raise exception 'Not allowed'; end if;
  return new;
end $$;
create trigger profiles_protect before update on public.profiles for each row execute function public.protect_profile_columns();

-- ---------- Row Level Security ----------
alter table public.profiles   enable row level security;
alter table public.journals   enable row level security;
alter table public.comments   enable row level security;
alter table public.reactions  enable row level security;
alter table public.user_steps enable row level security;
alter table public.reports    enable row level security;

-- profiles: pen names are public; only the owner can edit
create policy profiles_read   on public.profiles for select using (true);
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- journals: public (and not hidden) posts visible to all; owners see their own
create policy journals_read on public.journals for select
  using ((is_public and not is_hidden) or user_id = auth.uid());
create policy journals_insert on public.journals for insert to authenticated
  with check (user_id = auth.uid() and not is_hidden
              and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_banned));
create policy journals_update on public.journals for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy journals_delete on public.journals for delete to authenticated
  using (user_id = auth.uid());

-- comments: readable where the journal is readable. NO insert policy => only the server (service role) can add.
create policy comments_read on public.comments for select using (
  exists (select 1 from public.journals j where j.id = journal_id
          and ((j.is_public and not j.is_hidden) or j.user_id = auth.uid())));
create policy comments_delete on public.comments for delete to authenticated using (
  user_id = auth.uid()
  or exists (select 1 from public.journals j where j.id = journal_id and j.user_id = auth.uid()));

-- reactions
create policy reactions_read on public.reactions for select using (
  exists (select 1 from public.journals j where j.id = journal_id
          and ((j.is_public and not j.is_hidden) or j.user_id = auth.uid())));
create policy reactions_write on public.reactions for insert to authenticated with check (
  user_id = auth.uid()
  and exists (select 1 from public.journals j where j.id = journal_id and j.is_public and not j.is_hidden));
create policy reactions_update on public.reactions for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reactions_delete on public.reactions for delete to authenticated using (user_id = auth.uid());

-- user_steps: strictly private
create policy steps_all on public.user_steps for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reports: write-only for users; reviewed by you in the dashboard
create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid());
