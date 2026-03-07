alter table public.deals enable row level security;

drop policy if exists "Users can select own deals" on public.deals;
create policy "Users can select own deals"
  on public.deals for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own deals" on public.deals;
create policy "Users can insert own deals"
  on public.deals for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own deals" on public.deals;
create policy "Users can update own deals"
  on public.deals for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own deals" on public.deals;
create policy "Users can delete own deals"
  on public.deals for delete
  using (auth.uid() = user_id);

alter table public.deal_inputs enable row level security;

drop policy if exists "Users can select own deal inputs" on public.deal_inputs;
create policy "Users can select own deal inputs"
  on public.deal_inputs for select
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_inputs.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own deal inputs" on public.deal_inputs;
create policy "Users can insert own deal inputs"
  on public.deal_inputs for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.deals d
      where d.id = deal_inputs.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own deal inputs" on public.deal_inputs;
create policy "Users can update own deal inputs"
  on public.deal_inputs for update
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_inputs.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own deal inputs" on public.deal_inputs;
create policy "Users can delete own deal inputs"
  on public.deal_inputs for delete
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_inputs.deal_id and d.user_id = auth.uid()
    )
  );

alter table public.deal_files enable row level security;

drop policy if exists "Users can select own deal files" on public.deal_files;
create policy "Users can select own deal files"
  on public.deal_files for select
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_files.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own deal files" on public.deal_files;
create policy "Users can insert own deal files"
  on public.deal_files for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.deals d
      where d.id = deal_files.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own deal files" on public.deal_files;
create policy "Users can update own deal files"
  on public.deal_files for update
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_files.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own deal files" on public.deal_files;
create policy "Users can delete own deal files"
  on public.deal_files for delete
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_files.deal_id and d.user_id = auth.uid()
    )
  );

alter table public.deal_analyses enable row level security;

drop policy if exists "Users can select own deal analyses" on public.deal_analyses;
create policy "Users can select own deal analyses"
  on public.deal_analyses for select
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_analyses.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own deal analyses" on public.deal_analyses;
create policy "Users can insert own deal analyses"
  on public.deal_analyses for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.deals d
      where d.id = deal_analyses.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own deal analyses" on public.deal_analyses;
create policy "Users can update own deal analyses"
  on public.deal_analyses for update
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_analyses.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own deal analyses" on public.deal_analyses;
create policy "Users can delete own deal analyses"
  on public.deal_analyses for delete
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_analyses.deal_id and d.user_id = auth.uid()
    )
  );
