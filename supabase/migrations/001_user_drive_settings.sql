create table if not exists public.user_drive_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  drive_refresh_token text not null,
  root_folder_id text,
  root_folder_name text,
  root_folder_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_drive_settings enable row level security;

drop policy if exists "Users can read own drive settings" on public.user_drive_settings;
create policy "Users can read own drive settings"
  on public.user_drive_settings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own drive settings" on public.user_drive_settings;
create policy "Users can insert own drive settings"
  on public.user_drive_settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own drive settings" on public.user_drive_settings;
create policy "Users can update own drive settings"
  on public.user_drive_settings for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own drive settings" on public.user_drive_settings;
create policy "Users can delete own drive settings"
  on public.user_drive_settings for delete
  using (auth.uid() = user_id);
