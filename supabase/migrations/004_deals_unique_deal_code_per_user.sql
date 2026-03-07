do $$
declare
  r record;
  u uuid;
  n int;
begin
  for u in select distinct user_id from public.deals
  loop
    n := 1;
    for r in
      select id from public.deals
      where user_id = u
      order by created_at asc
    loop
      update public.deals
      set deal_code = 'DL-' || lpad((n)::text, 5, '0')
      where id = r.id;
      n := n + 1;
    end loop;
  end loop;
end $$;

create unique index if not exists deals_user_id_deal_code_key
  on public.deals (user_id, deal_code);
