create table if not exists public.deal_changelog (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

create index if not exists deal_changelog_deal_id_idx on public.deal_changelog (deal_id);
create index if not exists deal_changelog_user_id_created_at_idx on public.deal_changelog (user_id, created_at desc);

alter table public.deal_changelog enable row level security;

drop policy if exists "Users can read own changelog" on public.deal_changelog;
create policy "Users can read own changelog"
  on public.deal_changelog for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own changelog" on public.deal_changelog;
create policy "Users can insert own changelog"
  on public.deal_changelog for insert
  with check (auth.uid() = user_id);
